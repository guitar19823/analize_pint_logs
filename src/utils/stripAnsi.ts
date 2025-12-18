import { ANSI_REGEX } from "./constants";

export function stripAnsi(text: string): string {
  if (typeof text !== "string") {
    throw new TypeError("Ожидалась строка");
  }

  return text.replace(ANSI_REGEX, "");
}
