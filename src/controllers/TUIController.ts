import { Command } from "../config";
import { FileManager } from "../services/FileManager";
import { Table } from "../services/Table";
import { Tree } from "../services/Tree";
import { LogEntry, Node } from "../types";
import { debounce } from "../utils/debounce";
import { stripAnsi } from "../utils/stripAnsi";
import { throttle } from "../utils/throttle";
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
    height: 0,
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

  public moveUp = throttle((step = 1) => {
    const minIndex = 1;
    const maxStep = this.selectedIndex - minIndex;

    if (maxStep <= 0) return;

    const actualStep = Math.min(step, maxStep);

    this.selectedIndex -= actualStep;

    if (this.selectedIndex <= this.viewport.start) {
      this.viewport.start -= actualStep;
      this.viewport.end -= actualStep;
    }

    this.render();
  }, 50);

  public moveDown = throttle((step = 1) => {
    const maxIndex = this.table.length - this.bottomLimit;
    const maxStep = maxIndex - this.selectedIndex;

    if (maxStep <= 0) return;

    const actualStep = Math.min(step, maxStep);

    this.selectedIndex += actualStep;

    if (this.selectedIndex >= this.viewport.end - this.bottomLimit) {
      this.viewport.start += actualStep;
      this.viewport.end += actualStep;
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

  public handleResize = debounce(() => {
    this.updateViewport();
    this.render();
  }, 100);

  private updateViewport = () => {
    const size = TerminalIO.getSize();
    if (!size) return;

    const newHeight = size.rows - this.topLimit;
    this.viewport.height = Math.max(1, newHeight);
    this.viewport.end = this.viewport.start + this.viewport.height;

    if (this.selectedIndex >= this.viewport.end) {
      const offset = 4;
      this.viewport.start = this.selectedIndex - this.viewport.height + offset;
      this.viewport.start = Math.max(0, this.viewport.start);
    }

    const maxStart = Math.max(0, this.table.length - this.viewport.height);
    if (this.viewport.start > maxStart) {
      this.viewport.start = maxStart;
    }

    this.viewport.start = Math.max(0, this.viewport.start);
    this.viewport.end = this.viewport.start + this.viewport.height;
  };

  private getHelpMessage = () => `\n\n${[...Command.keys()].join(",  ")}.\n`;
}
