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
  private header: Row[] = [];
  private body: Row[] = [];
  private footer: Row[] = [];

  public selectedRow: Row | null = null;
  public headerSize = 0;
  public footerSize = 0;
  public numberOfMiddleBorders = 0;
  public borderSize = 1;

  constructor(public tree: ITree) {
    this.updateWidths(this.tree.root);
    this.addPads(this.tree.root);
    this.updateWidths(this.tree.root);
  }

  public render(selectedIndex: number, isUpdateFlatNodes: boolean) {
    this.numberOfMiddleBorders = 0;
    const lines: string[] = [];

    this.flattenTree(this.tree.root, isUpdateFlatNodes);

    this.headerSize = this.header.length + 2;
    this.footerSize = this.footer.length + 2;

    lines.push(this.getTableBorder(this.widths, BORDER_TOP));

    this.header.forEach((row) => {
      lines.push(this.getTableRow(this.getCells(row), HEADER_ROW));
    });

    if (this.header.length) {
      lines.push(this.getTableBorder(this.widths, BORDER_MIDDLE));
      this.numberOfMiddleBorders++;
    }

    this.body.forEach((row, index) => {
      const isSelected = index + this.header.length === selectedIndex;

      if (isSelected) {
        this.selectedRow = row;
      }

      lines.push(
        this.getTableRow(
          this.getCells(row, isSelected),
          isSelected ? BODY_ROW_ACTIVE : BODY_ROW
        )
      );
    });

    if (this.footer.length) {
      lines.push(this.getTableBorder(this.widths, BORDER_MIDDLE));
      this.numberOfMiddleBorders++;
    }

    this.footer.forEach((row) => {
      lines.push(this.getTableRow(this.getCells(row), FOOTER_ROW));
    });

    lines.push(this.getTableBorder(this.widths, BORDER_BOTTOM));

    return lines;
  }

  private getCells = (row: Row, isSelected = false) =>
    row.cells.map((it, idx) => {
      if (idx === 0) {
        return this.getName(row, it, isSelected);
      }

      return it;
    });

  private getName = (row: Row, cell: string, isSelected: boolean) => {
    const toggle = row.param.isExpanded ? Symbol.collapse : Symbol.expand;

    return `${Symbol.space.repeat(row.depth * INDENT)} ${
      isSelected ? Symbol.cursor : Symbol.space
    } ${row.hasChildrens ? toggle : Symbol.space} ${cell}`;
  };

  private getTableBorder = (
    widths: number[],
    {
      left,
      center,
      right,
      horizontal,
    }: { left: string; center: string; right: string; horizontal: string }
  ) =>
    widths.reduce(
      (acc, it, idx, data) =>
        acc +
        horizontal.repeat(it) +
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
    if (!isUpdateFlatNodes) {
      return;
    }

    this.header = [];
    this.body = [];
    this.footer = [];

    const traverse = (nodes: Node[], depth: number) => {
      for (const node of nodes) {
        if (node.param.type === RowType.HEADER) {
          this.header.push({
            cells: node.cells,
            hasChildrens: !!node.children?.length,
            depth: depth ?? 0,
            param: node.param,
          });
        }

        if (node.param.type === RowType.BODY) {
          this.body.push({
            cells: node.cells,
            hasChildrens: !!node.children?.length,
            depth: depth ?? 0,
            param: node.param,
          });
        }

        if (node.param.type === RowType.FOOTER) {
          this.footer.push({
            cells: node.cells,
            hasChildrens: !!node.children?.length,
            depth: depth ?? 0,
            param: node.param,
          });
        }

        if (node.param.isExpanded && node.children?.length) {
          traverse(node.children, depth + 1);
        }
      }
    };

    traverse(tree, 0);
  };
}
