import { NodeBoundary} from "../config";
import { ITree, LogEntry, Node, RowType } from "../types";
import { calculateDuration } from "../utils/date";

export class Tree implements ITree {
  public root: Node[] = [];
  private currentIndex = 0;

  constructor(logs: LogEntry[]) {
    this.buildTree(logs);
  }

  private buildTree = (logs: LogEntry[]): void => {
    this.addHeader();
    this.addBody(logs);
    this.addFooter(logs);
  };

  private addHeader = () => {
    const node = {
      cells: [
        "Название",
        "Начало",
        "Конец",
        "Длительность",
        "Значение",
      ],
      param: {
        id: this.currentIndex++,
        isExpanded: false,
        type: RowType.HEADER,
      },
    };

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
      cells: [
        "Всего:",
        firstLog.dateTime,
        lastLog.dateTime,
        calculateDuration(firstLog.dateTime, lastLog.dateTime),
        "",
      ],
      param: {
        id: this.currentIndex++,
        isExpanded: false,
        type: RowType.FOOTER,
      }
    };

    this.root.push(node);
  };

  private handleStartLog = (log: LogEntry, stack: Node[]): void => {
    const node = this.createNode(log);

    if (stack.length > 0) {
      stack[stack.length - 1].children?.push(node);
    } else {
      this.root.push(node);
    }

    stack.push(node);
  };

  private handleEndLog = (log: LogEntry, stack: Node[]): void => {
    if (stack.length === 0 || stack[stack.length - 1].cells[0] !== log.name) {
      return;
    }

    const node = stack.pop();

    if (!node) return;
    
    node.cells[2] = log.dateTime;
    node.cells[3] = calculateDuration(node.cells[1], node.cells[2]);
  };

  private handleOtherLog = (log: LogEntry, stack: Node[]): void => {
    const node = this.createNode(log, log.value || "");

    if (stack.length > 0) {
      stack[stack.length - 1].children?.push(node);
    } else {
      this.root.push(node);
    }
  };

  private createNode = (log: LogEntry, value = ""): Node => ({
    cells: [
      log.name,
      log.value === NodeBoundary.start ? log.dateTime : "",
      "",
      "",
      value,
    ],
    children: [],
    param: {
      id: this.currentIndex++,
      isExpanded: false,
      type: RowType.BODY,
    },
  });
}
