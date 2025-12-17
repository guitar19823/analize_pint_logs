import { ANSI_REGEX } from "./constants";

/**
 * Удаляет ANSI-эскейп-последовательности из строки
 * Безопасная реализация без проблемных диапазонов
 */
export function stripAnsi(text: string): string {
  if (typeof text !== "string") {
    throw new TypeError("Ожидалась строка");
  }

  return text.replace(ANSI_REGEX, "");
}
