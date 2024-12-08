export function safeAssign<T extends object>(
  target: T,
  ...args: Array<Partial<NoInfer<T>>>
) {
  Object.assign(target, ...args);
}

export type HasRequiredProps<T, True, False> = NonOptionalKeys<T> extends never
  ? False
  : True;
type NoInfer<T> = [T][T extends unknown ? 0 : never];

export type NonOptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];
export type OptionalIfVoid<T> = T extends void ? T | undefined : T;

export type UnwrapPromise<T> = T extends PromiseLike<infer V> ? V : T;
export type OmitFromUnion<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;
