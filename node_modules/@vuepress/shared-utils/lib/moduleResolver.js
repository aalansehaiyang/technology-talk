'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThemeResolver = exports.getPluginResolver = exports.getMarkdownItResolver = exports.CommonModule = exports.resolveScopePackage = void 0;
/**
 * Module dependencies.
 */
const upath_1 = __importDefault(require("upath"));
const chalk_1 = __importDefault(require("chalk"));
const moduleLoader_1 = require("./moduleLoader");
const tryChain_1 = __importDefault(require("./tryChain"));
const fallback_1 = require("./fallback");
const hash_sum_1 = __importDefault(require("hash-sum"));
const datatypes_1 = require("./datatypes");
/**
 * Parse info of scope package.
 */
const SCOPE_PACKAGE_RE = /^@(.*)\/(.*)/;
function resolveScopePackage(name) {
    if (SCOPE_PACKAGE_RE.test(name)) {
        return {
            org: RegExp.$1,
            name: RegExp.$2
        };
    }
    return {
        org: '',
        name: ''
    };
}
exports.resolveScopePackage = resolveScopePackage;
/**
 * Common module constructor.
 */
class CommonModule {
    constructor(entry, name, shortcut, fromDep, error) {
        this.entry = entry;
        this.name = name;
        this.shortcut = shortcut;
        this.fromDep = fromDep;
        this.error = error;
    }
}
exports.CommonModule = CommonModule;
function getNoopModule(error) {
    return new CommonModule(null, null, null, null, error);
}
class ModuleResolver {
    constructor(type, org, allowedTypes, load = false, cwd) {
        this.type = type;
        this.org = org;
        this.allowedTypes = allowedTypes;
        this.load = load;
        this.cwd = cwd;
        this.type = type;
        this.org = org;
        this.allowedTypes = allowedTypes;
        this.load = load;
        this.cwd = cwd || process.cwd();
        this.typePrefixLength = type.length + 1;
        if (org) {
            this.nonScopePrefix = `${org}-${type}-`;
            this.scopePrefix = `@${org}/${type}-`;
            this.prefixSlicePosition = this.typePrefixLength + org.length + 1;
        }
        else {
            this.nonScopePrefix = `${type}-`;
            this.prefixSlicePosition = this.typePrefixLength;
        }
    }
    /**
     * Resolve package.
     */
    resolve(req, cwd) {
        if (cwd) {
            this.setCwd(cwd);
        }
        const { valid, warnMsg } = (0, datatypes_1.assertTypes)(req, this.allowedTypes);
        if (!valid) {
            throw new Error(`Invalid value for "${chalk_1.default.cyan(this.type)}": ${warnMsg}`);
        }
        const isStringRequest = (0, datatypes_1.isString)(req);
        const resolved = (0, tryChain_1.default)([
            [this.resolveNonStringPackage.bind(this), !isStringRequest],
            [this.resolvePathPackage.bind(this), isStringRequest],
            [this.resolveDepPackage.bind(this), isStringRequest]
        ], req);
        if (!resolved) {
            return getNoopModule();
        }
        return resolved;
    }
    /**
     * Set current working directory.
     */
    setCwd(cwd) {
        this.cwd = cwd;
        return this;
    }
    /**
     * Resolve non-string package, return directly.
     */
    resolveNonStringPackage(req) {
        const { shortcut, name } = this.normalizeRequest(req);
        return new CommonModule(req, name, shortcut, false /* fromDep */);
    }
    /**
     * Resolve module with absolute/relative path.
     */
    resolvePathPackage(req) {
        if (!upath_1.default.isAbsolute(req)) {
            req = upath_1.default.resolve(this.cwd, req);
        }
        const normalized = (0, fallback_1.fsExistsFallback)([
            req,
            req + '.js',
            upath_1.default.resolve(req, 'index.js')
        ]);
        if (!normalized) {
            throw new Error(`${req} Not Found.`);
        }
        const dirname = upath_1.default.parse(normalized).name;
        const { shortcut, name } = this.normalizeName(dirname);
        try {
            const module = this.load ? require(normalized) : normalized;
            return new CommonModule(module, name, shortcut, false /* fromDep */);
        }
        catch (error) {
            return getNoopModule(error);
        }
    }
    /**
     * Resolve module from dependency.
     */
    resolveDepPackage(req) {
        const { shortcut, name } = this.normalizeName(req);
        try {
            const entry = this.load
                ? (0, moduleLoader_1.loadModule)(name, this.cwd)
                : (0, moduleLoader_1.resolveModule)(name, this.cwd);
            return new CommonModule(entry, name, shortcut, true /* fromDep */);
        }
        catch (error) {
            return getNoopModule(error);
        }
    }
    /**
     * Get shortcut.
     */
    getShortcut(req) {
        return req.startsWith(this.nonScopePrefix)
            ? req.slice(this.prefixSlicePosition)
            : req;
    }
    /**
     * Normalize string request name.
     */
    normalizeName(req) {
        let name = null;
        let shortcut = null;
        if (req.startsWith('@')) {
            const pkg = resolveScopePackage(req);
            // special handling for default org.
            if (this.org && pkg.org === this.org) {
                shortcut = pkg.name.startsWith(`${this.type}-`)
                    ? pkg.name.slice(this.typePrefixLength)
                    : pkg.name;
                name = `${this.scopePrefix}${shortcut}`;
            }
            else {
                shortcut = this.getShortcut(pkg.name);
                name = `@${pkg.org}/${this.nonScopePrefix}${shortcut}`;
            }
            shortcut = `@${pkg.org}/${shortcut}`;
        }
        else {
            shortcut = this.getShortcut(req);
            name = `${this.nonScopePrefix}${shortcut}`;
        }
        return { name, shortcut };
    }
    /**
     * Normalize any request.
     */
    normalizeRequest(req) {
        if ((0, datatypes_1.isString)(req)) {
            return this.normalizeName(req);
        }
        if ((0, datatypes_1.isObject)(req) || (0, datatypes_1.isFunction)(req)) {
            if ((0, datatypes_1.isString)(req.name)) {
                return this.normalizeName(req.name);
            }
            else {
                const shortcut = `anonymous-${(0, hash_sum_1.default)(req)}`;
                const name = `${this.nonScopePrefix}${shortcut}`;
                return { name, shortcut };
            }
        }
        return {
            name: null,
            shortcut: null
        };
    }
}
const getMarkdownItResolver = (cwd) => new ModuleResolver('markdown-it', '', [String, Function], true /* load module */, cwd);
exports.getMarkdownItResolver = getMarkdownItResolver;
const getPluginResolver = (cwd) => new ModuleResolver('plugin', 'vuepress', [String, Function, Object], true /* load module */, cwd);
exports.getPluginResolver = getPluginResolver;
const getThemeResolver = (cwd) => new ModuleResolver('theme', 'vuepress', [String], false /* load module */, cwd);
exports.getThemeResolver = getThemeResolver;
