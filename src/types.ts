export interface LogEntry {
  name: string;
  dateTime: string;
  value: string | null;
}

export const enum RowType {
  HEADER,
  BODY,
  FOOTER,
}
export interface Node {
  index: number;
  cells: string[],
  children: Node[];
  isExpanded: boolean;
  depth: number;
  rowType: RowType;
}

export interface ITree {
  root: Node[];
}

