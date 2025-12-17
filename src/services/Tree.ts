import { CURSOR_WIDTH, INDENT, NodeBoundary, PADDING, Symbol, TOGGLE_WIDTH } from "../config";
import { ITree, LogEntry, Node, RowType } from "../types";
import { calculateDuration } from "../utils/date";

export class Tree implements ITree {
  public root: Node[] = [];
  private currentIndex = 0;
  private widths: number[] = [];

  constructor(logs: LogEntry[]) {
    this.buildTree(logs);
  }

  private buildTree = (logs: LogEntry[]): void => {
    this.addHeader();
    this.addBody(logs);
    this.addFooter(logs);
    this.addPads(this.root);
  };

  private addHeader = () => {
    const node = {
      index: this.currentIndex++,
      cells: [
        "Название",
        "Начало",
        "Конец",
        "Длительность",
        "Значение",
      ],
      children: [],
      isExpanded: false,
      depth: 0,
      rowType: RowType.HEADER,
    };

    this.updateWidths(node, 1);
    this.root.push(node);
  };

  private addBody = (logs: LogEntry[]) => {
    const stack: Node[] = [];

    for (const log of logs) {
      if (log.value === NodeBoundary.start) {
        this.handleStartLog(log, stack);
      } else if (log.value === NodeBoundary.end || log.value === NodeBoundary.error) {
        this.handleEndLog(log, stack);
      } else {
        this.handleOtherLog(log, stack);
      }
    }
  };

  private addFooter = (logs: LogEntry[]) => {
    const firstLog = logs[0];
    const lastLog = logs[logs.length - 1];

    const node = {
      index: this.currentIndex++,
      cells: [
        "Всего:",
        firstLog.dateTime,
        lastLog.dateTime,
        calculateDuration(firstLog.dateTime, lastLog.dateTime),
        "",
      ],
      children: [],
      isExpanded: false,
      depth: 0,
      rowType: RowType.FOOTER,
    };

    this.updateWidths(node, 1);
    this.root.push(node);
  };

  private handleStartLog = (log: LogEntry, stack: Node[]): void => {
    const node = this.createNode(log, stack.length);

    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node);
    } else {
      this.root.push(node);
    }

    stack.push(node);
    this.updateWidths(node, node.depth);
  };

  private handleEndLog = (log: LogEntry, stack: Node[]): void => {
    if (stack.length === 0 || stack[stack.length - 1].cells[0] !== log.name) {
      return;
    }

    const node = stack.pop();

    if (!node) return;
    
    node.cells[2] = log.dateTime;
    node.cells[3] = calculateDuration(node.cells[1], node.cells[2]);

    this.updateWidths(node, node.depth);
  };

  private handleOtherLog = (log: LogEntry, stack: Node[]): void => {
    const node = this.createNode(log, stack.length, log.value || "");

    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node);
    } else {
      this.root.push(node);
    }

    this.updateWidths(node, node.depth);
  };

  private createNode = (log: LogEntry, depth: number, value = ""): Node => ({
    index: this.currentIndex++,
    cells: [
      log.name,
      log.value === NodeBoundary.start ? log.dateTime : "",
      "",
      "",
      value,
    ],
    children: [],
    isExpanded: false,
    depth,
    rowType: RowType.BODY,
  });

  private updateWidths = (node: Node, depth: number) => {
    const indentWidth = depth * INDENT;
    const toggleWidth = node.children.length && TOGGLE_WIDTH;

    node.cells.forEach((it, idx) => {
      const width = this.widths[idx] ?? 0;

      if (idx === 0) {
        const nameTotal = indentWidth + CURSOR_WIDTH + toggleWidth + it.length;

        this.widths[idx] = Math.max(width, nameTotal);

        return;
      }

      this.widths[idx] = Math.max(width, it.length);
    })
  };

  private addPads = (root: Node[]) => {
    root.forEach((it) => {
      it.cells.forEach((cell, idx) => {
        const width = this.widths[idx];

        if (idx === 0) {
          it.cells[idx] = cell.padEnd(
            width + PADDING - it.depth * INDENT,
            Symbol.space
          );

          return;
        }

        it.cells[idx] = cell
          .padStart(width + PADDING, Symbol.space)
          .padEnd(width + PADDING * 2, Symbol.space);
      });

      if (it.children.length) {
        this.addPads(it.children);
      }
    });
  };
}
