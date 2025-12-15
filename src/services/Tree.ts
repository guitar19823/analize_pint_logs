import { CURSOR_WIDTH, INDENT, PADDING, Symbol, TOGGLE_WIDTH } from "../config";
import { LogEntry, Node, RowType } from "../types";
import { calculateDuration } from "../utils/date";

export class Tree {
  private currentIndex = 0;
  public root: Node[] = [];

  private widths: Record<string, number> = {
    name: 0,
    start: 0,
    end: 0,
    duration: 0,
    value: 0,
  };

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
      name: "Название",
      start: "Начало",
      end: "Конец",
      duration: "Длительность",
      value: "Значение",
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
      if (log.value === "start") {
        this.handleStartLog(log, stack);
      } else if (log.value === "end" || log.value === "error") {
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
      name: "Всего:",
      start: firstLog.dateTime,
      end: lastLog.dateTime,
      duration: calculateDuration(firstLog.dateTime, lastLog.dateTime),
      value: "",
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
    if (stack.length === 0 || stack[stack.length - 1].name !== log.name) {
      return;
    }

    const node = stack.pop()!;
    node.end = log.dateTime;
    node.duration = calculateDuration(node.start, node.end);
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
    name: log.name,
    start: log.value === "start" ? log.dateTime : "",
    end: "",
    duration: "",
    value,
    children: [],
    isExpanded: false,
    depth,
    rowType: RowType.BODY,
  });

  private updateWidths = (node: Node, depth: number) => {
    const indentWidth = depth * INDENT;
    const toggleWidth = node.children.length && TOGGLE_WIDTH;

    const nameTotal =
      indentWidth + CURSOR_WIDTH + toggleWidth + node.name.length;

    this.widths.name = Math.max(this.widths.name, nameTotal);

    if (node.start) {
      this.widths.start = Math.max(this.widths.start, node.start.length);
    }

    if (node.end) {
      this.widths.end = Math.max(this.widths.end, node.end.length);
    }

    if (node.duration !== null) {
      this.widths.duration = Math.max(
        this.widths.duration,
        node.duration.length
      );
    }

    if (node.value) {
      this.widths.value = Math.max(this.widths.value, node.value.length);
    }
  };

  private addPads = (root: Node[]) => {
    root.forEach((it) => {
      it.name = it.name.padEnd(
        this.widths.name + PADDING - it.depth * INDENT,
        Symbol.space
      );

      it.start = it.start
        .padStart(this.widths.start + PADDING, Symbol.space)
        .padEnd(this.widths.start + PADDING * 2, Symbol.space);

      it.end = it.end
        .padStart(this.widths.end + PADDING, Symbol.space)
        .padEnd(this.widths.end + PADDING * 2, Symbol.space);

      it.duration = it.duration
        .padStart(this.widths.duration + PADDING, Symbol.space)
        .padEnd(this.widths.duration + PADDING * 2, Symbol.space);

      it.value = it.value
        .padStart(this.widths.value + PADDING, Symbol.space)
        .padEnd(this.widths.value + PADDING * 2, Symbol.space);

      this.addPads(it.children);
    });
  };
}
