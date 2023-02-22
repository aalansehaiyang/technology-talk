"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pitch = pitch;
exports.default = _default;

var _module = _interopRequireDefault(require("module"));

var _path = _interopRequireDefault(require("path"));

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _NodeTemplatePlugin = _interopRequireDefault(require("webpack/lib/node/NodeTemplatePlugin"));

var _NodeTargetPlugin = _interopRequireDefault(require("webpack/lib/node/NodeTargetPlugin"));

var _LibraryTemplatePlugin = _interopRequireDefault(require("webpack/lib/LibraryTemplatePlugin"));

var _SingleEntryPlugin = _interopRequireDefault(require("webpack/lib/SingleEntryPlugin"));

var _LimitChunkCountPlugin = _interopRequireDefault(require("webpack/lib/optimize/LimitChunkCountPlugin"));

var _schemaUtils = _interopRequireDefault(require("schema-utils"));

var _options = _interopRequireDefault(require("./options.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const MODULE_TYPE = 'css/mini-extract';
const pluginName = 'mini-css-extract-plugin';

function hotLoader(content, context) {
  const accept = context.locals ? '' : 'module.hot.accept(undefined, cssReload);';
  return `${content}
    if(module.hot) {
      // ${Date.now()}
      var cssReload = require(${_loaderUtils.default.stringifyRequest(context.context, _path.default.join(__dirname, 'hmr/hotModuleReplacement.js'))})(module.id, ${JSON.stringify(_objectSpread({}, context.options, {
    locals: !!context.locals
  }))});
      module.hot.dispose(cssReload);
      ${accept}
    }
  `;
}

const exec = (loaderContext, code, filename) => {
  const module = new _module.default(filename, loaderContext);
  module.paths = _module.default._nodeModulePaths(loaderContext.context); // eslint-disable-line no-underscore-dangle

  module.filename = filename;

  module._compile(code, filename); // eslint-disable-line no-underscore-dangle


  return module.exports;
};

const findModuleById = (modules, id) => {
  for (const module of modules) {
    if (module.id === id) {
      return module;
    }
  }

  return null;
};

function pitch(request) {
  const options = _loaderUtils.default.getOptions(this) || {};
  (0, _schemaUtils.default)(_options.default, options, 'Mini CSS Extract Plugin Loader');
  const loaders = this.loaders.slice(this.loaderIndex + 1);
  this.addDependency(this.resourcePath);
  const childFilename = '*'; // eslint-disable-line no-path-concat

  const publicPath = typeof options.publicPath === 'string' ? options.publicPath.endsWith('/') ? options.publicPath : `${options.publicPath}/` : typeof options.publicPath === 'function' ? options.publicPath(this.resourcePath, this.rootContext) : this._compilation.outputOptions.publicPath;
  const outputOptions = {
    filename: childFilename,
    publicPath
  };

  const childCompiler = this._compilation.createChildCompiler(`${pluginName} ${request}`, outputOptions);

  new _NodeTemplatePlugin.default(outputOptions).apply(childCompiler);
  new _LibraryTemplatePlugin.default(null, 'commonjs2').apply(childCompiler);
  new _NodeTargetPlugin.default().apply(childCompiler);
  new _SingleEntryPlugin.default(this.context, `!!${request}`, pluginName).apply(childCompiler);
  new _LimitChunkCountPlugin.default({
    maxChunks: 1
  }).apply(childCompiler); // We set loaderContext[MODULE_TYPE] = false to indicate we already in
  // a child compiler so we don't spawn another child compilers from there.

  childCompiler.hooks.thisCompilation.tap(`${pluginName} loader`, compilation => {
    compilation.hooks.normalModuleLoader.tap(`${pluginName} loader`, (loaderContext, module) => {
      // eslint-disable-next-line no-param-reassign
      loaderContext.emitFile = this.emitFile;
      loaderContext[MODULE_TYPE] = false; // eslint-disable-line no-param-reassign

      if (module.request === request) {
        // eslint-disable-next-line no-param-reassign
        module.loaders = loaders.map(loader => {
          return {
            loader: loader.path,
            options: loader.options,
            ident: loader.ident
          };
        });
      }
    });
  });
  let source;
  childCompiler.hooks.afterCompile.tap(pluginName, compilation => {
    source = compilation.assets[childFilename] && compilation.assets[childFilename].source(); // Remove all chunk assets

    compilation.chunks.forEach(chunk => {
      chunk.files.forEach(file => {
        delete compilation.assets[file]; // eslint-disable-line no-param-reassign
      });
    });
  });
  const callback = this.async();
  childCompiler.runAsChild((err, entries, compilation) => {
    if (err) {
      return callback(err);
    }

    if (compilation.errors.length > 0) {
      return callback(compilation.errors[0]);
    }

    compilation.fileDependencies.forEach(dep => {
      this.addDependency(dep);
    }, this);
    compilation.contextDependencies.forEach(dep => {
      this.addContextDependency(dep);
    }, this);

    if (!source) {
      return callback(new Error("Didn't get a result from child compiler"));
    }

    let text;
    let locals;

    try {
      text = exec(this, source, request);
      locals = text && text.locals;

      if (!Array.isArray(text)) {
        text = [[null, text]];
      } else {
        text = text.map(line => {
          const module = findModuleById(compilation.modules, line[0]);
          return {
            identifier: module.identifier(),
            content: line[1],
            media: line[2],
            sourceMap: line[3]
          };
        });
      }

      this[MODULE_TYPE](text);
    } catch (e) {
      return callback(e);
    }

    let resultSource = `// extracted by ${pluginName}`;
    const result = locals ? `\nmodule.exports = ${JSON.stringify(locals)};` : '';
    resultSource += options.hmr ? hotLoader(result, {
      context: this.context,
      options,
      locals
    }) : result;
    return callback(null, resultSource);
  });
}

function _default() {}