import { Color, Command, REZERVED_SIZE } from "../config";
import { FileManager } from "../services/FileManager";
import { Table } from "../services/Table";
import { ITree, Node } from "../types";
import { stripAnsi } from "../utils/stripAnsi";
import { throttle } from "../utils/throttle";
import { TerminalIO } from "../services/TerminalIO";
import { throttleTrailing } from "../utils/throttleTrailing";
import { truncateAnsiString } from "../utils/truncateAnsiString";

export class TUIController {
  private tree: ITree;
  private renderer: Table;
  private fileManager: FileManager;
  private table: string[] = [];
  private selectedIndex: number = 1;

  private viewport = {
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
  };

  constructor(tree: ITree) {
    this.tree = tree;
    this.renderer = new Table();
    this.fileManager = new FileManager();
    this.updateViewport();
  }

  public render = () => {
    this.table = this.renderer.render(this.tree.root, this.selectedIndex);

    const visibleTable = this.table
      .slice(this.viewport.top, this.viewport.bottom)
      .map((it) => {
        return (
          Color.RESET +
          truncateAnsiString(it, this.viewport.width) +
          Color.RESET
        );
      });

    TerminalIO.clear();
    TerminalIO.write(
      visibleTable.join("\n") +
        truncateAnsiString(this.getHelpMessage(), this.viewport.width)
    );
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

  public expand = () => {
    const selectedNode = this.renderer.selectedNode;

    if (selectedNode && selectedNode.children.length > 0) {
      selectedNode.isExpanded = true;
      this.render();
    }
  };

  public collapse = () => {
    const selectedNode = this.renderer.selectedNode;

    if (selectedNode) {
      selectedNode.isExpanded = false;
      this.render();
    }
  };

  public expandAll = () => {
    this.setExpansionState(true);
  };

  public collapseAll = () => {
    this.setExpansionState(false);
  };

  public exportTreeToFile = async (filePath: string) => {
    await this.fileManager.writeFile(
      filePath,
      JSON.stringify(this.tree, null, "\t")
    );
  };

  public exportTableToFile = async (filePath: string) => {
    await this.fileManager.writeFile(
      filePath,
      this.table.map(stripAnsi).join("\n")
    );
  };

  public handleResize = throttleTrailing(() => {
    this.updateViewport();
    this.render();
  }, 100);

  private updateViewport = () => {
    const size = TerminalIO.getSize();

    if (!size) return;

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

    this.viewport.bottom = this.viewport.top + this.viewport.height;
  };

  private setExpansionState = (isExpanded: boolean) => {
    const traverse = (nodes: Node[]) => {
      nodes.forEach((it) => {
        it.isExpanded = isExpanded;

        if (it.children.length) {
          traverse(it.children);
        }
      });
    };

    traverse(this.tree.root);

    this.selectedIndex = 1;
    this.viewport.top = 0;
    this.viewport.bottom = this.viewport.height;

    this.render();
  };

  private getHelpMessage = () => `\n\n${[...Command.keys()].join(",  ")}.\n`;
  // private getHelpMessage = () => `\n\n${this.selectedIndex} ${this.viewport.height} ${this.viewport.top} ${this.viewport.bottom}\n`;
}
