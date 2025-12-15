import {
  INDENT,
  Color,
  BORDER_TOP,
  BORDER_MIDDLE,
  BORDER_BOTTOM,
  HEADER_ROW,
  BODY_ROW,
  Symbol,
} from "../config";
import { TerminalIO } from "../controllers/TerminalIO";
import { Node, RowType } from "../types";
import { flattenTree } from "../utils/flattenTree";

export class Table {
  public selectedNode: Node | null = null;
  private terminalWidth = 80;

  public render(tree: Node[], selectedIndex: number) {
    this.terminalWidth = TerminalIO.getSize()?.columns || 80;
    const lines: string[] = [];
    const flatNodes = flattenTree(tree);

    flatNodes.forEach((node, index) => {
      const isSelected = index === selectedIndex;

      if (isSelected) {
        this.selectedNode = node;
      }

      this.addRow(lines, node, isSelected);
    });

    return lines;
  }

  private addRow = (lines: string[], node: Node, isSelected: boolean) => {
    const cells = [
      this.getName(node, isSelected),
      node.start,
      node.end,
      node.duration,
      node.value,
    ];

    switch (true) {
      case node.rowType === RowType.HEADER:
        lines.push(this.getTableBorder(cells, BORDER_TOP));
        lines.push(this.getTableRow(cells, HEADER_ROW) + Color.RESET);
        lines.push(this.getTableBorder(cells, BORDER_MIDDLE));
        break;

      case node.rowType === RowType.FOOTER:
        lines.push(this.getTableBorder(cells, BORDER_MIDDLE));
        lines.push(this.getTableRow(cells, BODY_ROW));
        lines.push(this.getTableBorder(cells, BORDER_BOTTOM));
        break;

      case isSelected && TerminalIO.isSupported():
        lines.push(this.activate(this.getTableRow(cells, BODY_ROW)));
        break;

      default:
        lines.push(this.getTableRow(cells, BODY_ROW));
    }
  };

  private trimRow = (row: string) => row.substring(0, this.terminalWidth)

  private getName = (node: Node, isSelected: boolean) => {
    const toggle = node.isExpanded ? Symbol.collapse : Symbol.expand;

    return `${Symbol.space.repeat(node.depth * INDENT)} ${
      isSelected ? Symbol.cursor : Symbol.space
    } ${node.children.length > 0 ? toggle : Symbol.space} ${node.name}`;
  };

  private activate = (line: string) =>
    Color.SELECTED_BG + Color.SELECTED_FG + line + Color.RESET;

  private getTableBorder = (
    cells: string[],
    {
      left,
      center,
      right,
      horizontal,
    }: { left: string; center: string; right: string; horizontal: string }
  ) =>
    cells.reduce(
      (acc, it, idx, data) =>
        acc +
        horizontal.repeat(it.length) +
        (idx === data.length - 1 ? right : center),
      left
    );

  private getTableRow = (
    cells: string[],
    { left, center }: { left: string; center: string }
  ) => cells.reduce((acc, it) => acc + it + center, left);
}
