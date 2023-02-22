import { BuildOptions, BuildFailure, Plugin } from 'esbuild';

declare function jsoncParse(data: string): any;
/**
 * Dynamically import files. It will make sure it's not being compiled away by TS/Rollup.
 *
 * As a temporary workaround for Jest's lack of stable ESM support, we fallback to require
 * if we're in a Jest environment.
 * See https://github.com/vitejs/vite/pull/5197#issuecomment-938054077
 *
 * @param file File path to import.
 */
declare const dynamicImport: RequireFunction;

declare const loadTsConfig: (dir?: string, filename?: string) => {
    data: any;
    path: string;
} | {
    data?: undefined;
    path?: undefined;
};

declare type RequireFunction = (outfile: string, ctx: {
    format: 'cjs' | 'esm';
}) => any;
declare type GetOutputFile = (filepath: string, format: 'esm' | 'cjs') => string;
interface Options {
    cwd?: string;
    /**
     * The filepath to bundle and require
     */
    filepath: string;
    /**
     * The `require` function that is used to load the output file
     * Default to the global `require` function
     * This function can be asynchronous, i.e. returns a Promise
     */
    require?: RequireFunction;
    /**
     * esbuild options
     */
    esbuildOptions?: BuildOptions;
    /**
     * Get the path to the output file
     * By default we simply replace the extension with `.bundled.js`
     */
    getOutputFile?: GetOutputFile;
    /**
     * Enable watching and call the callback after each rebuild
     */
    onRebuild?: (ctx: {
        err?: BuildFailure;
        mod?: any;
        dependencies?: string[];
    }) => void;
    /** External packages */
    external?: (string | RegExp)[];
    /** A custom tsconfig path to read `paths` option */
    tsconfig?: string;
}

declare const tsconfigPathsToRegExp: (paths: Record<string, any>) => RegExp[];
declare const match: (id: string, patterns?: (string | RegExp)[] | undefined) => boolean;
/**
 * An esbuild plugin to mark node_modules as external
 */
declare const externalPlugin: ({ external, notExternal, }?: {
    external?: (string | RegExp)[] | undefined;
    notExternal?: (string | RegExp)[] | undefined;
}) => Plugin;
declare const replaceDirnamePlugin: () => Plugin;
declare function bundleRequire(options: Options): Promise<{
    mod: any;
    dependencies: string[];
}>;

export { GetOutputFile, Options, RequireFunction, bundleRequire, dynamicImport, externalPlugin, jsoncParse, loadTsConfig, match, replaceDirnamePlugin, tsconfigPathsToRegExp };
