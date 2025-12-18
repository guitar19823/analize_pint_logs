import {
  INDENT,
  BORDER_TOP,
  BORDER_MIDDLE,
  BORDER_BOTTOM,
  HEADER_ROW,
  BODY_ROW,
  Symbol,
  PADDING,
  TOGGLE_WIDTH,
  CURSOR_WIDTH,
  ANSI,
  BODY_ROW_ACTIVE,
  FOOTER_ROW,
} from "../config";
import { ITree, Node, Row, RowType } from "../types";

export class Table {
  private readonly widths: number[] = [];
  private flatNodes: Row[] = [];

  public selectedRow: Row | null = null;
  public headerSize = 0;
  public footerSize = 0;
  public numberOfBodyBorders = 0;
  public borderSize = 1;

  constructor(public tree: ITree) {
    this.updateWidths(this.tree.root);
    this.addPads(this.tree.root);
  }

  public render(selectedIndex: number, isUpdateFlatNodes: boolean) {
    this.numberOfBodyBorders = 0;
    const lines: string[] = [];

    this.flattenTree(this.tree.root, isUpdateFlatNodes).forEach(
      (row, index) => {
        const isSelected = index === selectedIndex;

        if (isSelected) {
          this.selectedRow = row;
        }

        this.addRow(lines, row, isSelected);
      }
    );

    return lines;
  }

  private addRow = (lines: string[], row: Row, isSelected: boolean) => {
    const cells = row.cells.map((it, idx) => {
      if (idx === 0) {
        return this.getName(row, it, isSelected);
      }

      return it;
    });

    switch (true) {
      case row.param.type === RowType.HEADER:
        const header = [
          this.getTableBorder(cells, BORDER_TOP),
          this.getTableRow(cells, HEADER_ROW),
          this.getTableBorder(cells, BORDER_MIDDLE),
        ];

        this.headerSize = header.length;
        this.numberOfBodyBorders++;

        lines.push(...header);
        break;

      case row.param.type === RowType.FOOTER:
        const footer = [
          this.getTableBorder(cells, BORDER_MIDDLE),
          this.getTableRow(cells, FOOTER_ROW),
          this.getTableBorder(cells, BORDER_BOTTOM),
        ];

        this.footerSize = footer.length;
        this.numberOfBodyBorders++;

        lines.push(...footer);
        break;

      case isSelected:
        lines.push(this.getTableRow(cells, BODY_ROW_ACTIVE));
        break;

      default:
        lines.push(this.getTableRow(cells, BODY_ROW));
    }
  };

  private getName = (row: Row, cell: string, isSelected: boolean) => {
    const toggle = row.param.isExpanded ? Symbol.collapse : Symbol.expand;

    return `${Symbol.space.repeat(row.depth * INDENT)} ${
      isSelected ? Symbol.cursor : Symbol.space
    } ${row.hasChildrens ? toggle : Symbol.space} ${cell}`;
  };

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
  ) => cells.reduce((acc, it) => acc + it + center, left) + ANSI.RESET;

  private updateWidths = (nodes: Node[], depth = 0) => {
    nodes.forEach((it) => {
      const indentWidth = depth * INDENT;
      const toggleWidth = (it.children?.length ?? 0) && TOGGLE_WIDTH;

      it.cells.forEach((cell, idx) => {
        const width = this.widths[idx] ?? 0;

        if (idx === 0) {
          const nameTotal =
            indentWidth + CURSOR_WIDTH + toggleWidth + cell.length;
          this.widths[idx] = Math.max(width, nameTotal);

          return;
        }

        this.widths[idx] = Math.max(width, cell.length);
      });

      if (it.children?.length) {
        this.updateWidths(it.children, depth + 1);
      }
    });
  };

  private addPads = (nodes: Node[], depth = 0) => {
    nodes.forEach((it) => {
      it.cells.forEach((cell, idx) => {
        const width = this.widths[idx];

        if (idx === 0) {
          it.cells[idx] = cell.padEnd(
            width + PADDING - depth * INDENT,
            Symbol.space
          );

          return;
        }

        it.cells[idx] = cell
          .padStart(width + PADDING, Symbol.space)
          .padEnd(width + PADDING * 2, Symbol.space);
      });

      if (it.children?.length) {
        this.addPads(it.children, depth + 1);
      }
    });
  };

  private flattenTree = (tree: Node[], isUpdateFlatNodes: boolean) => {
    if (isUpdateFlatNodes) {
      this.flatNodes = [];

      const traverse = (nodes: Node[], depth: number) => {
        for (const node of nodes) {
          this.flatNodes.push({
            cells: node.cells,
            hasChildrens: !!node.children?.length,
            depth: depth ?? 0,
            param: node.param,
          });

          if (node.param.isExpanded && node.children?.length) {
            traverse(node.children, depth + 1);
          }
        }
      };

      traverse(tree, 0);
    }

    return this.flatNodes;
  };
}
