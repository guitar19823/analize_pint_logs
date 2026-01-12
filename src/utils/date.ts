export const parseDateTime = (dt: string): number => {
  const [date, time] = dt.split(":");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, min, sec, ms] = time.split("-").map(Number);

  return new Date(year, month - 1, day, hour, min, sec, ms).getTime();
};

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;

  return `${seconds}.${milliseconds.toString().padStart(3, "0")}s`;
};

export const calculateDuration = (
  start: string | undefined | null,
  end: string | undefined | null
): number => {
  if (!start || !end) return 0;

  return parseDateTime(end) - parseDateTime(start);
};
