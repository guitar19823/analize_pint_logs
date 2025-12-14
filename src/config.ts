export const INDENT = 2;
export const CURSOR_WIDTH = 3;
export const TOGGLE_WIDTH = 2;
export const PADDING = 1;

// Цвета в формате ANSI
export const enum Color {
  SELECTED_BG = "\x1b[48;5;235m", // Тёмно‑серый фон
  SELECTED_FG = "\x1b[38;5;15m", // Белый текст
  HEADER_BG = "\x1b[48;5;24m", // Тёмно‑синий фон заголовка
  HEADER_FG = "\x1b[38;5;15m", // Белый текст заголовка
  RESET = "\x1b[0m", // Сброс стилей
}

export const enum Border {
  tL = "┌",
  tR = "┐",
  bL = "└",
  bR = "┘",
  hr = "─",
  vr = "│",
  cr = "┼",
  mL = "├",
  mR = "┤",
  tC = "┬",
  bC = "┴",
}

export const enum Symbol {
  cursor = ">",
  collapse = "-",
  expand = "+",
  space = " ",
}

export const BORDER_TOP = {
  left: Border.tL,
  center: Border.tC,
  right: Border.tR,
  horizontal: Border.hr,
};

export const BORDER_MIDDLE = {
  left: Border.mL,
  center: Border.cr,
  right: Border.mR,
  horizontal: Border.hr,
};

export const BORDER_BOTTOM = {
  left: Border.bL,
  center: Border.bC,
  right: Border.bR,
  horizontal: Border.hr,
};

export const HEADER_ROW = {
  left: Border.vr + Color.HEADER_BG + Color.HEADER_FG,
  center: Color.RESET + Border.vr + Color.HEADER_BG + Color.HEADER_FG,
};

export const BODY_ROW = {
  left: Border.vr,
  center: Border.vr,
};
