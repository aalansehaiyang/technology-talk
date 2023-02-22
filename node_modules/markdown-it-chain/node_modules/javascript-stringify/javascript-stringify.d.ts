declare function stringify (value: any, replacer?: Function, space?: string | number, options?: javascriptStringify.Options): string;

declare namespace javascriptStringify {
  export interface Options {
    maxDepth?: number;
    references?: boolean;
  }
}

export = stringify;
