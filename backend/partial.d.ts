declare type PartialOmit<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>;
