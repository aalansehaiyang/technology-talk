/**
 * Build functional pipeline.
 */
declare type Pipe<T, U> = (...args: T[]) => U;
declare const _default: <T>(...processors: Pipe<any, T>[]) => Pipe<any, T>;
export = _default;
