declare type Provider<T, U> = (arg: T) => U;
declare type Resolver<T, U> = (Provider<T, U> | boolean)[] | Provider<T, U>;
declare const _default: <T, U>(resolvers: Resolver<T, U>[], arg: T) => void | U;
export = _default;
