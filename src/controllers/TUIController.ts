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

  constructor(logs: LogEntry[]) {
    this.tree = new Tree(logs);
  }

  public render = () => {
    this.table = this.renderer.render(this.tree.root, this.selectedIndex);

    TerminalIO.clear();
    TerminalIO.write(this.table.join("\n") + this.getHelpMessage());
  };

  public moveUp = () => {
    if (this.selectedIndex > 1) {
      this.selectedIndex--;
      this.render();
    }
  };

  public moveDown = () => {
    if (this.selectedIndex < this.table.length - 6) {
      this.selectedIndex++;
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

  private getHelpMessage = () =>
    "\n[↑] Вверх,  [↓] Вниз,  [→] Раскрыть,  [←] Свернуть, [Ctrl+Z] Раскрыть всё, [Ctrl+X] Свернуть всё,  [Ctrl+S] Экспорт,  [Esc] Выход.\n";
}
