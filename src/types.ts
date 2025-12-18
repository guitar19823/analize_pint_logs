export interface LogEntry {
  readonly name: string;
  readonly dateTime: string;
  readonly value: string | null;
}

export const enum RowType {
  HEADER,
  BODY,
  FOOTER,
}

export interface IParam {
  readonly type: RowType;
  readonly id: number;
  isExpanded: boolean;
}

export interface Node {
  readonly cells: string[],
  readonly param: IParam;
  readonly children?: Node[];
}

export interface Row {
  readonly cells: string[],
  readonly hasChildrens: boolean;
  readonly depth: number;
  readonly param: IParam;
}

export interface ITree {
  readonly root: Node[];
}

