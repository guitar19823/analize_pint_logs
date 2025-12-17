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
import { TerminalIO } from "./TerminalIO";
import { Node, RowType } from "../types";
import { flattenTree } from "../utils/flattenTree";

export class Table {
  public selectedNode: Node | null = null;
  public headerSize = 0;
  public footerSize = 0;
  public numberOfBodyBorders = 0;
  public borderSize = 1;

  public render(tree: Node[], selectedIndex: number) {
    this.numberOfBodyBorders = 0;
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
    const cells = node.cells.map((it, idx) => {
      if (idx === 0) {
        return this.getName(node, it, isSelected);
      }

      return it;
    })

    switch (true) {
      case node.rowType === RowType.HEADER:
        const header = [
          this.getTableBorder(cells, BORDER_TOP),
          this.getTableRow(cells, HEADER_ROW) + Color.RESET,
          this.getTableBorder(cells, BORDER_MIDDLE),
        ];

        this.headerSize = header.length;
        this.numberOfBodyBorders++;

        lines.push(...header)
        break;

      case node.rowType === RowType.FOOTER:
        const footer = [
          this.getTableBorder(cells, BORDER_MIDDLE),
          this.getTableRow(cells, BODY_ROW),
          this.getTableBorder(cells, BORDER_BOTTOM),
        ];

        this.footerSize = footer.length;
        this.numberOfBodyBorders++;

        lines.push(...footer)
        break;

      case isSelected && TerminalIO.isSupported():
        lines.push(this.activate(this.getTableRow(cells, BODY_ROW)));
        break;

      default:
        lines.push(this.getTableRow(cells, BODY_ROW));
    }
  };

  private getName = (node: Node, cell: string, isSelected: boolean) => {
    const toggle = node.isExpanded ? Symbol.collapse : Symbol.expand;

    return `${Symbol.space.repeat(node.depth * INDENT)} ${
      isSelected ? Symbol.cursor : Symbol.space
    } ${node.children.length > 0 ? toggle : Symbol.space} ${cell}`;
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
