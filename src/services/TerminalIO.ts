export class TerminalIO {
  private static sizeListeners: ((size: {
    columns: number;
    rows: number;
  }) => void)[] = [];

  static onResize(
    callback: (size: { columns: number; rows: number }) => void
  ): void {
    this.sizeListeners.push(callback);
  }

  static removeResizeListener(
    callback: (size: { columns: number; rows: number }) => void
  ): void {
    this.sizeListeners = this.sizeListeners.filter((cb) => cb !== callback);
  }

  static checkResize(): void {
    const size = this.getSize();
    if (size) {
      this.sizeListeners.forEach((listener) => listener(size));
    }
  }

  /**
   * Полная очистка терминала (экран + буфер прокрутки)
   */
  static clear(): void {
    if (!this.isSupported()) return;
    this.write("\x1b[2J\x1b[3J\x1b[H\x1b[0m");
  }

  /**
   * Очистка от текущей позиции курсора до конца экрана
   */
  static clearFromCursor(): void {
    if (!this.isSupported()) return;
    this.write("\x1b[J");
  }

  /**
   * Очистка текущей строки
   */
  static clearLine(): void {
    if (!this.isSupported()) return;
    this.write("\x1b[2K");
  }

  /**
   * Перемещение курсора в верхний левый угол (0,0)
   */
  static gotoHome(): void {
    if (!this.isSupported()) return;
    this.write("\x1b[H");
  }

  /**
   * Асинхронная очистка с задержкой (помогает медленным терминалам)
   * @param delayMs - задержка в миллисекундах (по умолчанию 5)
   */
  static async clearAsync(delayMs = 5): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    this.clear();
  }

  /**
   * Вывод текста в терминал
   * @param text - текст для вывода
   * @param newLine - добавить перенос строки (по умолчанию true)
   */
  static write(text: string, newLine = true): void {
    if (!this.isSupported()) return;
    try {
      process.stdout.write(text + (newLine ? "\n" : ""));
    } catch (e) {
      // Игнорируем ошибки записи
    }
  }

  /**
   * Получение размера терминала
   * @returns { columns: number, rows: number } или null если недоступно
   */
  static getSize(): { columns: number; rows: number } | null {
    if (!process.stdout.isTTY) return null;
    return {
      columns: process.stdout.columns ?? 80,
      rows: process.stdout.rows ?? 24,
    };
  }

  /**
   * Проверка поддержки ANSI-кодов текущим терминалом
   */
  public static isSupported(): boolean {
    return (
      process.stdout.isTTY &&
      process.env.TERM !== "dumb" &&
      !process.env.TERM?.includes("linux")
    );
  }
}
