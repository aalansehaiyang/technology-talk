var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/index.ts
__export(exports, {
  bundleRequire: () => bundleRequire,
  dynamicImport: () => dynamicImport,
  externalPlugin: () => externalPlugin,
  jsoncParse: () => jsoncParse,
  loadTsConfig: () => loadTsConfig,
  match: () => match,
  replaceDirnamePlugin: () => replaceDirnamePlugin,
  tsconfigPathsToRegExp: () => tsconfigPathsToRegExp
});
var import_fs3 = __toModule(require("fs"));
var import_path3 = __toModule(require("path"));
var import_url = __toModule(require("url"));
var import_esbuild = __toModule(require("esbuild"));

// src/utils.ts
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));

// node_modules/.pnpm/strip-json-comments@4.0.0/node_modules/strip-json-comments/index.js
var singleComment = Symbol("singleComment");
var multiComment = Symbol("multiComment");
var stripWithoutWhitespace = () => "";
var stripWithWhitespace = (string, start, end) => string.slice(start, end).replace(/\S/g, " ");
var isEscaped = (jsonString, quotePosition) => {
  let index = quotePosition - 1;
  let backslashCount = 0;
  while (jsonString[index] === "\\") {
    index -= 1;
    backslashCount += 1;
  }
  return Boolean(backslashCount % 2);
};
function stripJsonComments(jsonString, { whitespace = true } = {}) {
  if (typeof jsonString !== "string") {
    throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``);
  }
  const strip = whitespace ? stripWithWhitespace : stripWithoutWhitespace;
  let isInsideString = false;
  let isInsideComment = false;
  let offset = 0;
  let result = "";
  for (let index = 0; index < jsonString.length; index++) {
    const currentCharacter = jsonString[index];
    const nextCharacter = jsonString[index + 1];
    if (!isInsideComment && currentCharacter === '"') {
      const escaped = isEscaped(jsonString, index);
      if (!escaped) {
        isInsideString = !isInsideString;
      }
    }
    if (isInsideString) {
      continue;
    }
    if (!isInsideComment && currentCharacter + nextCharacter === "//") {
      result += jsonString.slice(offset, index);
      offset = index;
      isInsideComment = singleComment;
      index++;
    } else if (isInsideComment === singleComment && currentCharacter + nextCharacter === "\r\n") {
      index++;
      isInsideComment = false;
      result += strip(jsonString, offset, index);
      offset = index;
      continue;
    } else if (isInsideComment === singleComment && currentCharacter === "\n") {
      isInsideComment = false;
      result += strip(jsonString, offset, index);
      offset = index;
    } else if (!isInsideComment && currentCharacter + nextCharacter === "/*") {
      result += jsonString.slice(offset, index);
      offset = index;
      isInsideComment = multiComment;
      index++;
      continue;
    } else if (isInsideComment === multiComment && currentCharacter + nextCharacter === "*/") {
      index++;
      isInsideComment = false;
      result += strip(jsonString, offset, index + 1);
      offset = index + 1;
      continue;
    }
  }
  return result + (isInsideComment ? strip(jsonString.slice(offset)) : jsonString.slice(offset));
}

// src/utils.ts
function jsoncParse(data) {
  try {
    return new Function("return " + stripJsonComments(data).trim())();
  } catch (_) {
    return {};
  }
}
var getPkgType = () => {
  try {
    const pkg = JSON.parse(import_fs.default.readFileSync(import_path.default.resolve("package.json"), "utf-8"));
    return pkg.type;
  } catch (error) {
  }
};
function guessFormat(inputFile) {
  if (!usingDynamicImport)
    return "cjs";
  const ext = import_path.default.extname(inputFile);
  const type = getPkgType();
  if (ext === ".js") {
    return type === "module" ? "esm" : "cjs";
  } else if (ext === ".ts") {
    return "esm";
  } else if (ext === ".mjs") {
    return "esm";
  }
  return "cjs";
}
var usingDynamicImport = typeof jest === "undefined";
var dynamicImport = (id, { format }) => {
  const fn = format === "esm" ? new Function("file", "return import(file)") : require;
  return fn(id);
};

// src/tsconfig.ts
var import_path2 = __toModule(require("path"));
var import_fs2 = __toModule(require("fs"));
var loadTsConfig = (dir = process.cwd(), filename = "tsconfig.json") => {
  const { root } = import_path2.default.parse(dir);
  while (dir !== root) {
    const filepath = import_path2.default.join(dir, filename);
    if (import_fs2.default.existsSync(filepath)) {
      const contents = import_fs2.default.readFileSync(filepath, "utf8");
      return { data: jsoncParse(contents), path: filepath };
    }
    dir = import_path2.default.dirname(dir);
  }
  return {};
};

// src/index.ts
var JS_EXT_RE = /\.(mjs|cjs|ts|js|tsx|jsx)$/;
function inferLoader(ext) {
  if (ext === ".mjs" || ext === ".cjs")
    return "js";
  return ext.slice(1);
}
var defaultGetOutputFile = (filepath, format) => filepath.replace(JS_EXT_RE, `.bundled_${Date.now()}.${format === "esm" ? "mjs" : "cjs"}`);
var tsconfigPathsToRegExp = (paths) => {
  return Object.keys(paths || {}).map((key) => {
    return new RegExp(`^${key.replace(/\*/, ".*")}$`);
  });
};
var match = (id, patterns) => {
  if (!patterns)
    return false;
  return patterns.some((p) => {
    if (p instanceof RegExp) {
      return p.test(id);
    }
    return id === p || id.startsWith(p + "/");
  });
};
var externalPlugin = ({
  external,
  notExternal
} = {}) => {
  return {
    name: "bundle-require:external",
    setup(ctx) {
      ctx.onResolve({ filter: /.*/ }, async (args) => {
        if (args.path[0] === "." || import_path3.default.isAbsolute(args.path)) {
          return;
        }
        if (match(args.path, external)) {
          return {
            external: true
          };
        }
        if (match(args.path, notExternal)) {
          return;
        }
        return {
          external: true
        };
      });
    }
  };
};
var replaceDirnamePlugin = () => {
  return {
    name: "bundle-require:replace-path",
    setup(ctx) {
      ctx.onLoad({ filter: JS_EXT_RE }, async (args) => {
        const contents = await import_fs3.default.promises.readFile(args.path, "utf-8");
        return {
          contents: contents.replace(/\b__filename\b/g, JSON.stringify(args.path)).replace(/\b__dirname\b/g, JSON.stringify(import_path3.default.dirname(args.path))).replace(/\bimport\.meta\.url\b/g, JSON.stringify(`file://${args.path}`)),
          loader: inferLoader(import_path3.default.extname(args.path))
        };
      });
    }
  };
};
async function bundleRequire(options) {
  var _a, _b, _c, _d;
  if (!JS_EXT_RE.test(options.filepath)) {
    throw new Error(`${options.filepath} is not a valid JS file`);
  }
  const cwd = options.cwd || process.cwd();
  const format = guessFormat(options.filepath);
  const tsconfig = loadTsConfig(options.cwd, options.tsconfig);
  const resolvePaths = tsconfigPathsToRegExp(((_b = (_a = tsconfig.data) == null ? void 0 : _a.compilerOptions) == null ? void 0 : _b.paths) || {});
  const extractResult = async (result2) => {
    if (!result2.outputFiles) {
      throw new Error(`[bundle-require] no output files`);
    }
    const { text } = result2.outputFiles[0];
    const getOutputFile = options.getOutputFile || defaultGetOutputFile;
    const outfile = getOutputFile(options.filepath, format);
    await import_fs3.default.promises.writeFile(outfile, text, "utf8");
    let mod;
    const req = options.require || dynamicImport;
    try {
      mod = await req(format === "esm" ? (0, import_url.pathToFileURL)(outfile).href : outfile, { format });
    } finally {
      await import_fs3.default.promises.unlink(outfile);
    }
    return {
      mod,
      dependencies: result2.metafile ? Object.keys(result2.metafile.inputs) : []
    };
  };
  const result = await (0, import_esbuild.build)(__spreadProps(__spreadValues({}, options.esbuildOptions), {
    entryPoints: [options.filepath],
    absWorkingDir: cwd,
    outfile: "out.js",
    format,
    platform: "node",
    sourcemap: "inline",
    bundle: true,
    metafile: true,
    write: false,
    watch: ((_c = options.esbuildOptions) == null ? void 0 : _c.watch) || options.onRebuild && {
      async onRebuild(err, result2) {
        if (err) {
          return options.onRebuild({ err });
        }
        if (result2) {
          options.onRebuild(await extractResult(result2));
        }
      }
    },
    plugins: [
      ...((_d = options.esbuildOptions) == null ? void 0 : _d.plugins) || [],
      externalPlugin({
        external: options.external,
        notExternal: resolvePaths
      }),
      replaceDirnamePlugin()
    ]
  }));
  return extractResult(result);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bundleRequire,
  dynamicImport,
  externalPlugin,
  jsoncParse,
  loadTsConfig,
  match,
  replaceDirnamePlugin,
  tsconfigPathsToRegExp
});
