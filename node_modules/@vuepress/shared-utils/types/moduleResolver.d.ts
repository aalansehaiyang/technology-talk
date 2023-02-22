export interface ScopePackage {
    org: string;
    name: string;
}
export declare function resolveScopePackage(name: string): {
    org: string;
    name: string;
};
/**
 * Common module constructor.
 */
export declare class CommonModule {
    entry: string | null;
    name: string | null;
    shortcut: string | null;
    fromDep: boolean | null;
    error?: Error | undefined;
    constructor(entry: string | null, name: string | null, shortcut: string | null, fromDep: boolean | null, error?: Error | undefined);
}
export interface NormalizedModuleRequest {
    name: string | null;
    shortcut: string | null;
}
/**
 * Expose ModuleResolver.
 */
declare type Type = string | number | boolean | RegExp | Function | Record<string, any> | Record<string, any> | Array<any>;
declare class ModuleResolver {
    private type;
    private org;
    private allowedTypes;
    private load;
    private cwd;
    private nonScopePrefix;
    private scopePrefix;
    private typePrefixLength;
    private prefixSlicePosition;
    constructor(type: string, org: string, allowedTypes: Type[], load: boolean, cwd: string);
    /**
     * Resolve package.
     */
    resolve(req: string, cwd: string): CommonModule | never;
    /**
     * Set current working directory.
     */
    private setCwd;
    /**
     * Resolve non-string package, return directly.
     */
    private resolveNonStringPackage;
    /**
     * Resolve module with absolute/relative path.
     */
    resolvePathPackage(req: string): CommonModule;
    /**
     * Resolve module from dependency.
     */
    private resolveDepPackage;
    /**
     * Get shortcut.
     */
    private getShortcut;
    /**
     * Normalize string request name.
     */
    normalizeName(req: string): NormalizedModuleRequest;
    /**
     * Normalize any request.
     */
    normalizeRequest(req: any): NormalizedModuleRequest;
}
export declare const getMarkdownItResolver: (cwd: string) => ModuleResolver;
export declare const getPluginResolver: (cwd: string) => ModuleResolver;
export declare const getThemeResolver: (cwd: string) => ModuleResolver;
export {};
