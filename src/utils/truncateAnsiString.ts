import { ANSI_REGEX } from "./constants";

export const truncateAnsiString = (
  str: string,
  length: number,
  fromStart: boolean = false
) => {
  const ansiRegex = new RegExp(ANSI_REGEX);

  const tokens: { type: "ansi" | "text"; value: string }[] = [];
  let lastIndex = 0;

  const matches = str.matchAll(ansiRegex);
  for (const match of matches) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "text",
        value: str.slice(lastIndex, match.index),
      });
    }

    tokens.push({
      type: "ansi",
      value: match[0],
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < str.length) {
    tokens.push({
      type: "text",
      value: str.slice(lastIndex),
    });
  }

  let visibleLength = 0;
  for (const token of tokens) {
    if (token.type === "text") {
      visibleLength += token.value.length;
    }
  }

  if (visibleLength <= length) {
    return str;
  }

  const resultTokens: { type: "ansi" | "text"; value: string }[] = [];
  let accumulatedVisible = 0;

  if (fromStart) {
    const skipUntil = visibleLength - length;
    for (const token of tokens) {
      if (token.type === "ansi") {
        resultTokens.push(token);
      } else {
        const text = token.value;
        if (accumulatedVisible < skipUntil) {
          const canSkip = Math.min(text.length, skipUntil - accumulatedVisible);
          accumulatedVisible += canSkip;
          const remainingText = text.slice(canSkip);
          if (remainingText.length > 0) {
            resultTokens.push({ type: "text", value: remainingText });
            accumulatedVisible += remainingText.length;
          }
        } else {
          resultTokens.push(token);
          accumulatedVisible += text.length;
        }
      }
    }
  } else {
    for (const token of tokens) {
      if (token.type === "ansi") {
        resultTokens.push(token);
      } else {
        const text = token.value;
        const available = length - accumulatedVisible;
        if (available <= 0) {
          break;
        }
        const trimmedText = text.slice(0, available);
        resultTokens.push({ type: "text", value: trimmedText });
        accumulatedVisible += trimmedText.length;
      }
    }
  }

  return resultTokens.map((t) => t.value).join("");
};
