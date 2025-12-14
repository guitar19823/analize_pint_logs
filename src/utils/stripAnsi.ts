/**
 * Удаляет ANSI-эскейп-последовательности из строки
 * Безопасная реализация без проблемных диапазонов
 */

const ANSI_REGEX =
  /\u001B(?:\[(?:[0-9]{0,3}(?:;[0-9]{0,3})*)?[a-zA-Z@`]|[\]](?:[^\x07\x1B]|\\x1B[^\x40-\x5F])*(?:\x07|\\x1B[\x40-\x5F])|[\x40-\x5F][\x30-\x3F]*[\x20-\x2F]*[\x40-\x7E]|[\x30-\x3F][\x20-\x2F]+[\x40-\x7E])/g;

export function stripAnsi(text: string): string {
  if (typeof text !== "string") {
    throw new TypeError("Ожидалась строка");
  }

  return text.replace(ANSI_REGEX, "");
}
