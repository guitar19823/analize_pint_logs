export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let lastCall = 0;

  return function (...args: Parameters<T>): void {
    const now = Date.now();

    if (now - lastCall >= delay) {
      func(...args);
      lastCall = now;
    }
  };
};
