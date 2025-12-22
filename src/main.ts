import { FileManager } from "./services/FileManager";
import { ProcessTUI } from "./controllers/ProcessTUI";
import { Tree } from "./services/Tree";
import { testTree } from "./testTree";
import { randomTree } from "./randomTree";

(async () => {
  try {
    const file = new FileManager();
    const tree = new Tree(await file.read("./logs.json"));
    // const tree = testTree;
    // const tree = randomTree;
    const app = new ProcessTUI(tree);

    app.start();
  } catch (error) {
    console.error("Ошибка при запуске:", error);
    process.exit(1);
  }
})();
