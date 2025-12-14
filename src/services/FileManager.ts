import * as fs from "fs/promises";
import { LogEntry } from "../types";
import { TerminalIO } from "../controllers/TerminalIO";

export class FileManager {
  public read = async (filePath: string): Promise<LogEntry[]> => {
    try {
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Ошибка при чтении файла:", err);
      throw err;
    }
  };

  public writeFile = async (
    filePath: string,
    content: string
  ): Promise<void> => {
    try {
      await fs.writeFile(filePath, content, "utf8");
      TerminalIO.write(`Данные успешно экспортированы в ${filePath}`);
    } catch (err) {
      TerminalIO.write(`Ошибка при записи файла: ${err}`);
    }
  };
}
