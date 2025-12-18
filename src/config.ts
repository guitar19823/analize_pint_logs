export const INDENT = 2;
export const CURSOR_WIDTH = 3;
export const TOGGLE_WIDTH = 2;
export const PADDING = 1;
export const REZERVED_SIZE = 5;
export const SCROLL_STEP_VR = 3;
export const SCROLL_STEP_HR = 3;
export const TABLE_FILE_PATH = "table.txt";

export const enum ANSI {
  // Фон (Background)
  BG_BLACK = "\x1b[48;5;0m",
  BG_RED = "\x1b[48;5;1m",
  BG_GREEN = "\x1b[48;5;2m",
  BG_YELLOW = "\x1b[48;5;3m",
  BG_BLUE = "\x1b[48;5;4m",
  BG_MAGENTA = "\x1b[48;5;5m",
  BG_CYAN = "\x1b[48;5;6m",
  BG_WHITE = "\x1b[48;5;7m",
  BG_GRAY = "\x1b[48;5;235m",
  BG_DARK_BLUE = "\x1b[48;5;24m",
  BG_BRIGHT_RED = "\x1b[48;5;196m",
  BG_BRIGHT_GREEN = "\x1b[48;5;46m",
  BG_BRIGHT_YELLOW = "\x1b[48;5;226m",
  BG_BRIGHT_BLUE = "\x1b[48;5;39m",
  BG_BRIGHT_MAGENTA = "\x1b[48;5;201m",
  BG_BRIGHT_CYAN = "\x1b[48;5;51m",

  // Текст (Text)
  TX_BLACK = "\x1b[38;5;0m",
  TX_RED = "\x1b[38;5;1m",
  TX_GREEN = "\x1b[38;5;2m",
  TX_YELLOW = "\x1b[38;5;3m",
  TX_BLUE = "\x1b[38;5;4m",
  TX_MAGENTA = "\x1b[38;5;5m",
  TX_CYAN = "\x1b[38;5;6m",
  TX_WHITE = "\x1b[38;5;15m",
  TX_GRAY = "\x1b[38;5;244m",
  TX_DARK_BLUE = "\x1b[38;5;24m",
  TX_BRIGHT_RED = "\x1b[38;5;196m",
  TX_BRIGHT_GREEN = "\x1b[38;5;46m",
  TX_BRIGHT_YELLOW = "\x1b[38;5;226m",
  TX_BRIGHT_BLUE = "\x1b[38;5;39m",
  TX_BRIGHT_MAGENTA = "\x1b[38;5;201m",
  TX_BRIGHT_CYAN = "\x1b[38;5;51m",

  // Сброс стилей
  RESET = "\x1b[0m",
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

const borderColor = ANSI.TX_BRIGHT_BLUE;
const headerRow = ANSI.TX_BRIGHT_CYAN;
const bodyRow = ANSI.TX_BRIGHT_BLUE;
const activeRow = ANSI.BG_BRIGHT_BLUE + ANSI.TX_BLACK;
const footerRow = ANSI.TX_BRIGHT_CYAN;

export const BORDER_TOP = {
  left: borderColor + Border.tL + ANSI.RESET,
  center: borderColor + Border.tC + ANSI.RESET,
  right: borderColor + Border.tR + ANSI.RESET,
  horizontal: borderColor + Border.hr + ANSI.RESET,
};

export const BORDER_MIDDLE = {
  left: borderColor + Border.mL + ANSI.RESET,
  center: borderColor + Border.cr + ANSI.RESET,
  right: borderColor + Border.mR + ANSI.RESET,
  horizontal: borderColor + Border.hr + ANSI.RESET,
};

export const BORDER_BOTTOM = {
  left: borderColor + Border.bL + ANSI.RESET,
  center: borderColor + Border.bC + ANSI.RESET,
  right: borderColor + Border.bR + ANSI.RESET,
  horizontal: borderColor + Border.hr + ANSI.RESET,
};

export const HEADER_ROW = {
  left: borderColor + Border.vr + ANSI.RESET + headerRow,
  center: ANSI.RESET + borderColor + Border.vr + ANSI.RESET + headerRow,
};

export const BODY_ROW = {
  left: borderColor + Border.vr + ANSI.RESET + bodyRow,
  center: borderColor + Border.vr + ANSI.RESET + bodyRow,
};

export const BODY_ROW_ACTIVE = {
  left: borderColor + Border.vr + ANSI.RESET + activeRow,
  center: ANSI.RESET + borderColor + Border.vr + ANSI.RESET + activeRow,
};

export const FOOTER_ROW = {
  left: borderColor + Border.vr + ANSI.RESET + footerRow,
  center: ANSI.RESET + borderColor + Border.vr + ANSI.RESET + footerRow,
};

export const Command = new Map([
  ["[↑] Вверх", "\x1b[A"],
  ["[↓] Вниз", "\x1b[B"],
  ["[→] Раскрыть", "\x1b[B"],
  ["[←] Свернуть", "\x1b[B"],
  ["[Ctrl →] Раскрыть всё", "\x1b[B"],
  ["[Ctrl ←] Свернуть всё", "\x1b[B"],
  ["[Shift →] Вправо", "\x1b[B"],
  ["[Shift ←] Влево", "\x1b[B"],
  ["[Ctrl S] Экспорт", "\x1b[B"],
  ["[Esc] Выход", "\x1b[B"],
]);

export const enum NodeBoundary {
  start = "start",
  end = "end",
  error = "error",
}
