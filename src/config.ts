export const INDENT = 2;
export const CURSOR_WIDTH = 3;
export const TOGGLE_WIDTH = 2;
export const PADDING = 1;
export const REZERVED_SIZE = 5;
export const SCROLL_STEP_VR = 3;
export const SCROLL_STEP_HR = 3;
export const TABLE_FILE_PATH = 'table.txt';

export const enum ANSI {
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
  left: Border.vr + ANSI.HEADER_BG + ANSI.HEADER_FG,
  center: ANSI.RESET + Border.vr + ANSI.HEADER_BG + ANSI.HEADER_FG,
};

export const BODY_ROW = {
  left: Border.vr,
  center: Border.vr,
};

export const Command = new Map([
  ['[↑] Вверх', '\x1b[A'],
  ['[↓] Вниз', '\x1b[B'],
  ['[→] Раскрыть', '\x1b[B'],
  ['[←] Свернуть', '\x1b[B'],
  ['[Ctrl →] Раскрыть всё', '\x1b[B'],
  ['[Ctrl ←] Свернуть всё', '\x1b[B'],
  ['[Shift →] Вправо', '\x1b[B'],
  ['[Shift ←] Влево', '\x1b[B'],
  ['[Ctrl S] Экспорт', '\x1b[B'],
  ['[Esc] Выход', '\x1b[B'],
]);

export const enum NodeBoundary {
  start = "start",
  end = "end",
  error = "error",
}
