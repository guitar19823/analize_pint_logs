import * as readline from "readline";
import { TUIController } from "./TUIController";
import { LogEntry } from "../types";
import { TerminalIO } from "./TerminalIO";

export class ProcessTUI {
  private controller: TUIController;
  private rl: readline.Interface;
  private isRunning = true;

  constructor(logs: LogEntry[]) {
    this.controller = new TUIController(logs);

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
  }

  public start = () => {
    TerminalIO.clear();

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    this.controller.render();

    process.stdin.on("data", (input) => {
      if (!this.isRunning) return;

      const char = input.toString();

      switch (char) {
        case "\x1b[A":
          this.controller.moveUp();
          break;

        case "\x1b[B":
          this.controller.moveDown();
          break;

        case "\x1b[5~":
          this.controller.moveUp(5);
          break;

        case "\x1b[6~":
          this.controller.moveDown(5);
          break;

        case "\x1b[C":
          this.controller.expand();
          break;

        case "\x1b[D":
          this.controller.collapse();
          break;

        case "\x1b[1;5C":
        case "\x1b[5C":
          this.controller.expandAll();
          break;

        case "\x1b[1;5D":
        case "\x1b[5D":
          this.controller.collapseAll();
          break;

        case "\x13":
          this.controller.exportTableToFile();
          break;

        case "\x1b":
          this.stop();
          break;
      }
    });

    process.on("SIGWINCH", () => {
      TerminalIO.checkResize();
      this.controller.handleResize();
    });

    process.on("SIGINT", () => {
      this.stop();
    });
  };

  private stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    process.stdin.setRawMode(false);
    process.stdin.pause();
    this.rl.close();
    TerminalIO.clear();
    process.exit(0);
  }
}
