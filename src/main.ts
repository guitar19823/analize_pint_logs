import { FileManager } from "./services/FileManager";
import { ProcessTUI } from "./controllers/ProcessTUI";

(async () => {
  try {
    const logReader = new FileManager();
    const app = new ProcessTUI(await logReader.read("./logs.json"));
    app.start();
  } catch (error) {
    console.error("Ошибка при запуске:", error);
    process.exit(1);
  }
})();
