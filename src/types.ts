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

export interface CellNames {
  name: string;
  start: string;
  end: string;
  duration: string;
  value: string;
}

export interface Service {
  index: number;
  children: Node[];
  isExpanded: boolean;
  depth: number;
  rowType: RowType;
}

export interface Node extends CellNames, Service {}
