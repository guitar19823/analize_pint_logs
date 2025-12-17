export const throttleTrailing = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
) => {
  let lastCallTime = 0;
  let pendingArgs: Parameters<T> | null = null;
  let timeoutId: NodeJS.Timeout | undefined;

  const execute = () => {
    const now = Date.now();

    if (now - lastCallTime >= delay) {
      if (pendingArgs) {
        func(...pendingArgs);

        lastCallTime = now;
        pendingArgs = null;
      }
    }
  };

  return (...args: Parameters<T>): void => {
    pendingArgs = args;
    if (!timeoutId) {
      func(...args);

      lastCallTime = Date.now();

      timeoutId = setTimeout(() => {
        execute();

        timeoutId = undefined;
      }, delay);
    }
  };
};
