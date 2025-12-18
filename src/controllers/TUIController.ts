import {
  ANSI,
  Command,
  SCROLL_STEP_HR,
  REZERVED_SIZE,
  TABLE_FILE_PATH,
} from "../config";
import { FileManager } from "../services/FileManager";
import { Table } from "../services/Table";
import { ITree, Node } from "../types";
import { stripAnsi } from "../utils/stripAnsi";
import { throttle } from "../utils/throttle";
import { TerminalIO } from "../services/TerminalIO";
import { throttleTrailing } from "../utils/throttleTrailing";
import { ansiSlice } from "../utils/ansiSlice";
import { performance } from "node:perf_hooks";

export class TUIController {
  private renderer: Table;
  private fileManager: FileManager;
  private table: string[] = [];
  private tableWidth: number = 0;
  private selectedIndex: number = 1;
  private duration = 0;

  private viewport = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    prevWidth: 0,
    prevHeight: 0,
  };

  constructor(tree: ITree) {
    this.renderer = new Table(tree);
    this.fileManager = new FileManager();
    this.updateViewport();
  }

  public render = (isUpdateFlatNodes = false) => {
    const start = performance.now();

    this.table = this.renderer.render(this.selectedIndex, isUpdateFlatNodes);
    this.tableWidth = stripAnsi(this.table[0] ?? "").length;

    const visibleTable = this.table
      .map(
        (it) =>
          ansiSlice(it, this.viewport.left, this.viewport.right) + ANSI.RESET
      )
      .slice(this.viewport.top, this.viewport.bottom);

    TerminalIO.clear();
    TerminalIO.write(visibleTable.join("\n"));

    this.duration = performance.now() - start;
    TerminalIO.write(this.getHelpMessage());
  };

  public moveUp = throttle((step = 1) => {
    if (this.selectedIndex <= 1) return;

    const topLimit = this.viewport.top + this.renderer.borderSize;
    const actualStep = Math.min(
      step,
      this.selectedIndex - this.renderer.borderSize
    );
    this.selectedIndex -= actualStep;

    if (this.selectedIndex < topLimit) {
      this.viewport.top = Math.max(0, this.viewport.top - actualStep);
      this.viewport.bottom = this.viewport.top + this.viewport.height;
    }

    this.render();
  }, 50);

  public moveDown = throttle((step = 1) => {
    const sizeToEnd =
      this.table.length -
      this.selectedIndex -
      this.renderer.headerSize -
      this.renderer.footerSize;

    if (sizeToEnd <= 0) return;

    const bottomLimnit =
      this.viewport.bottom -
      this.renderer.footerSize -
      this.renderer.borderSize * this.renderer.numberOfBodyBorders;

    const actualStep = Math.min(step, sizeToEnd);
    this.selectedIndex += actualStep;

    if (this.selectedIndex >= bottomLimnit) {
      this.viewport.top += actualStep;
      this.viewport.bottom += actualStep;
    }

    this.render();
  }, 50);

  public moveLeft = throttle((step = SCROLL_STEP_HR) => {
    if (this.viewport.left > 0) {
      step = Math.min(step, this.viewport.left);
      this.viewport.left -= step;
      this.viewport.right -= step;
      this.render();
    }
  }, 0);

  public moveRight = throttle((step = SCROLL_STEP_HR) => {
    if (this.viewport.right < this.tableWidth) {
      step = Math.min(step, this.tableWidth - this.viewport.right);
      this.viewport.left += step;
      this.viewport.right += step;
      this.render();
    }
  }, 50);

  public expand = () => {
    const selectedNode = this.renderer.selectedRow;

    if (
      selectedNode &&
      !selectedNode.param.isExpanded &&
      selectedNode.hasChildrens
    ) {
      this.renderer.tree;
      selectedNode.param.isExpanded = true;
      this.render(true);
    }
  };

  public collapse = () => {
    const selectedNode = this.renderer.selectedRow;

    if (selectedNode?.param.isExpanded) {
      selectedNode.param.isExpanded = false;
      this.render(true);
    }
  };

  public expandAll = () => {
    this.setExpansionState(true);
  };

  public collapseAll = () => {
    this.setExpansionState(false);
  };

  public exportTreeToFile = async () => {
    await this.fileManager.writeFile(
      TABLE_FILE_PATH,
      JSON.stringify(this.renderer.tree, null, "\t")
    );
  };

  public exportTableToFile = async () => {
    await this.fileManager.writeFile(
      TABLE_FILE_PATH,
      this.table.map(stripAnsi).join("\n")
    );
  };

  public handleResize = throttleTrailing(() => {
    this.updateViewport();
    this.render();
  }, 50);

  private updateViewport = () => {
    const size = TerminalIO.getSize();

    if (!size) return;

    this.viewport.prevWidth = this.viewport.width;
    this.viewport.width = size.columns;
    this.viewport.height = size.rows - REZERVED_SIZE;

    if (this.viewport.height >= 1) {
      this.viewport.bottom = this.selectedIndex + this.renderer.headerSize;
    }

    if (
      this.viewport.height >=
      1 + this.renderer.headerSize + this.renderer.footerSize
    ) {
      this.viewport.bottom =
        this.selectedIndex +
        this.renderer.footerSize +
        this.renderer.footerSize;
    }

    this.viewport.top = Math.max(
      0,
      this.viewport.bottom - this.viewport.height
    );

    if (this.viewport.right > this.tableWidth && this.viewport.left > 0) {
      this.viewport.left = Math.max(
        0,
        this.viewport.left - this.viewport.right + this.tableWidth
      );
    }

    this.viewport.bottom = this.viewport.top + this.viewport.height;
    this.viewport.right = this.viewport.left + this.viewport.width - 1;
  };

  private setExpansionState = (isExpanded: boolean) => {
    const traverse = (nodes: Node[]) => {
      nodes.forEach((it) => {
        it.param.isExpanded = isExpanded;

        if (it.children?.length) {
          traverse(it.children);
        }
      });
    };

    traverse(this.renderer.tree.root);

    this.selectedIndex = 1;
    this.viewport.top = 0;
    this.viewport.bottom = this.viewport.height;

    this.render(true);
  };

  private getHelpMessage = () =>
    `\n${ANSI.TX_BRIGHT_BLUE}${[...Command.keys()]
      .join(", ")
      .slice(this.viewport.left, this.viewport.right)}.${ANSI.RESET}\n`;
}
