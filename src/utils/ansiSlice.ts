import { ANSI_REGEX } from "./constants";

export const ansiSlice = (
  str: string,
  start?: number,
  end?: number
): string => {
  const ansiRegex = new RegExp(ANSI_REGEX, "g");

  const normalizeIndex = (idx: number | undefined, len: number): number => {
    if (idx === undefined) return 0;
    if (idx < 0) return Math.max(0, len + idx);
    return Math.min(idx, len);
  };

  let visibleLength = 0;
  let lastIndex = 0;
  let match;
  ansiRegex.lastIndex = 0;

  while ((match = ansiRegex.exec(str)) !== null) {
    visibleLength += match.index - lastIndex;
    lastIndex = match.index + match[0].length;
  }

  visibleLength += str.length - lastIndex;

  const startIdx = normalizeIndex(start, visibleLength);
  const endIdx = normalizeIndex(end, visibleLength);

  if (startIdx >= endIdx) return "";

  let result = "";
  let currentVisible = 0;
  lastIndex = 0;
  ansiRegex.lastIndex = 0;

  while (true) {
    match = ansiRegex.exec(str);
    const ansiStart = match ? match.index : str.length;
    const text = str.slice(lastIndex, ansiStart);

    if (text.length > 0) {
      const textEnd = currentVisible + text.length;

      if (textEnd <= startIdx) {
        currentVisible = textEnd;
      } else if (currentVisible >= endIdx) {
        break;
      } else {
        const sliceStart = Math.max(startIdx - currentVisible, 0);
        const sliceEnd = Math.min(endIdx - currentVisible, text.length);

        if (sliceStart < sliceEnd) {
          result += text.slice(sliceStart, sliceEnd);
          currentVisible += sliceEnd;
        } else {
          currentVisible = textEnd;
        }
      }
    }

    if (!match) break;

    if (currentVisible < endIdx) {
      result += match[0];
    }

    lastIndex = match.index + match[0].length;
  }

  return result;
};
