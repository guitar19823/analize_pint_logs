import { Command } from "../config";
import { FileManager } from "../services/FileManager";
import { Table } from "../services/Table";
import { Tree } from "../services/Tree";
import { LogEntry, Node } from "../types";
import { stripAnsi } from "../utils/stripAnsi";
import { TerminalIO } from "./TerminalIO";

export class TUIController {
  private tree: Tree;
  private table: string[] = [];
  private selectedIndex: number = 1;
  private renderer = new Table();
  private fileManager = new FileManager();
  private topLimit = 5;
  private bottomLimit = 6;

  private viewport = {
    start: 0,
    end: 0,
    height: 0
  };

  constructor(logs: LogEntry[]) {
    this.tree = new Tree(logs);
    this.updateViewport();
  }

  public render = () => {
    this.table = this.renderer.render(this.tree.root, this.selectedIndex);

    const visibleTable = this.table.slice(
      this.viewport.start,
      this.viewport.end
    );

    TerminalIO.clear();
    TerminalIO.write(visibleTable.join("\n") + this.getHelpMessage());
  };

  public moveUp = () => {
    if (this.selectedIndex > 1) {
      this.selectedIndex--;

      if (this.selectedIndex <= this.viewport.start) {
        this.viewport.start--;
        this.viewport.end--;
      }

      this.render();
    }
  };

  public moveDown = () => {
    if (this.selectedIndex < this.table.length - this.bottomLimit) {
      this.selectedIndex++;

      if (this.selectedIndex >= this.viewport.end - this.bottomLimit) {
        this.viewport.start++;
        this.viewport.end++;
      }
      
      this.render();
    }
  };

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
    const traverse = (nodes: Node[]) => {
      nodes.forEach((it) => {
        it.isExpanded = true;

        traverse(it.children);
      });
    };

    traverse(this.tree.root);
    
    this.selectedIndex = 1;
    this.viewport.start = 0;
    this.viewport.end = this.viewport.height;

    this.render();
  };

  public collapseAll = () => {
    const traverse = (nodes: Node[]) => {
      nodes.forEach((it) => {
        it.isExpanded = false;

        traverse(it.children);
      });
    };

    traverse(this.tree.root);

    this.selectedIndex = 1;
    this.viewport.start = 0;
    this.viewport.end = this.viewport.height;

    this.render();
  };

  public exportTreeToFile = async () => {
    const filePath = `tree.txt`;

    await this.fileManager.writeFile(
      filePath,
      JSON.stringify(this.tree, null, "\t")
    );
  };

  public exportTableToFile = async () => {
    const filePath = `table.txt`;

    await this.fileManager.writeFile(
      filePath,
      this.table.map(stripAnsi).join("\n")
    );
  };

  public handleResize = () => {
    this.updateViewport();
    this.render();
  }

  private updateViewport = () => {
    const size = TerminalIO.getSize();

    if (size) {
      this.viewport.height = size.rows - this.topLimit;
      this.viewport.end = this.viewport.start + this.viewport.height;
    }
  }

  private getHelpMessage = () =>
    `\n\n${[...Command.keys()].join(",  ")}\n`;
}
