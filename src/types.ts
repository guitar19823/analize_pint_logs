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
  name: string;
  start: string;
  end: string;
  duration: string;
  value: string;
  children: Node[];
  isExpanded: boolean;
  depth: number;
  rowType: RowType;
}
