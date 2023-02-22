export declare const isObject: (obj: any) => boolean;
export declare const isFunction: (x: any) => boolean;
export declare const isString: (x: any) => boolean;
export declare const isBoolean: (x: any) => boolean;
export declare const isPlainObject: (x: string) => boolean;
export declare const isUndefined: (x: any) => boolean;
export declare const isNull: (x: any) => boolean;
export declare const isNullOrUndefined: (x: any) => boolean;
export declare const toRawType: (value: any) => any;
export declare const getType: (fn: any) => any;
/**
 * Transform multi-types to natural language. e.g.
 *   ['Function']                     => 'Function'
 *   ['Function', 'Object']           => 'Function or Object'
 *   ['Function', 'Object', 'Number'] => 'Function, Object or Number'
 */
declare type Type = string | number | boolean | RegExp | Function | Record<string, any> | Array<any>;
export declare function assertTypes(value: any, types: Type[]): {
    valid: any;
    warnMsg: any;
};
export {};
