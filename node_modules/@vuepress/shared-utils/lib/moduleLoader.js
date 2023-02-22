"use strict";
// Modified from https://github.com/vuejs/vue-cli/blob/dev/packages/@0vue/cli-shared-utils/lib/module.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearModule = exports.loadModule = exports.resolveModule = void 0;
const semver_1 = __importDefault(require("semver"));
const env_1 = __importDefault(require("./env"));
function resolveFallback(request, options) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Module = require('module');
    const isMain = false;
    const fakeParent = new Module('', null);
    const paths = [];
    for (let i = 0; i < options.paths.length; i++) {
        const path = (options.paths)[i];
        fakeParent.paths = Module._nodeModulePaths(path);
        const lookupPaths = Module._resolveLookupPaths(request, fakeParent, true);
        if (!paths.includes(path))
            paths.push(path);
        for (let j = 0; j < lookupPaths.length; j++) {
            if (!paths.includes(lookupPaths[j]))
                paths.push(lookupPaths[j]);
        }
    }
    const filename = Module._findPath(request, paths, isMain);
    if (!filename) {
        const err = new Error(`Cannot find module '${request}'`);
        err.code = 'MODULE_NOT_FOUND';
        throw err;
    }
    return filename;
}
function clearRequireCache(id, map = new Map()) {
    const module = require.cache[id];
    if (module) {
        map.set(id, true);
        // Clear children modules
        module.children.forEach((child) => {
            if (!map.get(child.id))
                clearRequireCache(child.id, map);
        });
        delete require.cache[id];
    }
}
const resolve = semver_1.default.satisfies(process.version, '>=10.0.0')
    ? require.resolve
    : resolveFallback;
function resolveModule(request, context) {
    if (env_1.default.isTest) {
        return require.resolve(request);
    }
    // module.paths is for globally install packages.
    const paths = [context || process.cwd(), ...module.paths];
    const resolvedPath = resolve(request, { paths });
    return resolvedPath;
}
exports.resolveModule = resolveModule;
function loadModule(request, context, force = false) {
    const resolvedPath = resolveModule(request, context);
    if (resolvedPath) {
        if (force) {
            clearRequireCache(resolvedPath);
        }
        return require(resolvedPath);
    }
}
exports.loadModule = loadModule;
function clearModule(request, context) {
    const resolvedPath = resolveModule(request, context);
    if (resolvedPath) {
        clearRequireCache(resolvedPath);
    }
}
exports.clearModule = clearModule;
