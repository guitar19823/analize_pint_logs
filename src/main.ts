import { FileManager } from "./services/FileManager";
import { ProcessTUI } from "./controllers/ProcessTUI";
import { Tree } from "./services/Tree";

(async () => {
  try {
    const file = new FileManager();
    const tree = new Tree(await file.read("./logs.json"))
    const app = new ProcessTUI(tree, 'table.txt');

    app.start();
  } catch (error) {
    console.error("Ошибка при запуске:", error);
    process.exit(1);
  }
})();
