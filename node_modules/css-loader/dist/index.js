"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;

var _schemaUtils = _interopRequireDefault(require("schema-utils"));

var _postcss = _interopRequireDefault(require("postcss"));

var _package = _interopRequireDefault(require("postcss/package.json"));

var _postcssModulesLocalByDefault = _interopRequireDefault(require("postcss-modules-local-by-default"));

var _postcssModulesExtractImports = _interopRequireDefault(require("postcss-modules-extract-imports"));

var _postcssModulesScope = _interopRequireDefault(require("postcss-modules-scope"));

var _postcssModulesValues = _interopRequireDefault(require("postcss-modules-values"));

var _loaderUtils = require("loader-utils");

var _normalizePath = _interopRequireDefault(require("normalize-path"));

var _options = _interopRequireDefault(require("./options.json"));

var _plugins = require("./plugins");

var _utils = require("./utils");

var _Warning = _interopRequireDefault(require("./Warning"));

var _CssSyntaxError = _interopRequireDefault(require("./CssSyntaxError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
function loader(content, map, meta) {
  const options = (0, _loaderUtils.getOptions)(this) || {};
  (0, _schemaUtils.default)(_options.default, options, 'CSS Loader');
  const callback = this.async();
  const sourceMap = options.sourceMap || false;
  /* eslint-disable no-param-reassign */

  if (sourceMap) {
    if (map) {
      // Some loader emit source map as string
      // Strip any JSON XSSI avoidance prefix from the string (as documented in the source maps specification), and then parse the string as JSON.
      if (typeof map === 'string') {
        map = JSON.parse(map.replace(/^\)]}'[^\n]*\n/, ''));
      } // Source maps should use forward slash because it is URLs (https://github.com/mozilla/source-map/issues/91)
      // We should normalize path because previous loaders like `sass-loader` using backslash when generate source map


      if (map.file) {
        map.file = (0, _normalizePath.default)(map.file);
      }

      if (map.sourceRoot) {
        map.sourceRoot = (0, _normalizePath.default)(map.sourceRoot);
      }

      if (map.sources) {
        map.sources = map.sources.map(source => (0, _normalizePath.default)(source));
      }
    }
  } else {
    // Some loaders (example `"postcss-loader": "1.x.x"`) always generates source map, we should remove it
    map = null;
  }
  /* eslint-enable no-param-reassign */
  // Reuse CSS AST (PostCSS AST e.g 'postcss-loader') to avoid reparsing


  if (meta) {
    const {
      ast
    } = meta;

    if (ast && ast.type === 'postcss' && ast.version === _package.default.version) {
      // eslint-disable-next-line no-param-reassign
      content = ast.root;
    }
  }

  const plugins = [];

  if (options.modules) {
    const loaderContext = this;
    const mode = typeof options.modules === 'boolean' ? 'local' : options.modules;
    plugins.push(_postcssModulesValues.default, (0, _postcssModulesLocalByDefault.default)({
      mode
    }), (0, _postcssModulesExtractImports.default)(), (0, _postcssModulesScope.default)({
      generateScopedName: function generateScopedName(exportName) {
        const localIdentName = options.localIdentName || '[hash:base64]';
        const customGetLocalIdent = options.getLocalIdent || _utils.getLocalIdent;
        return customGetLocalIdent(loaderContext, localIdentName, exportName, {
          regExp: options.localIdentRegExp,
          hashPrefix: options.hashPrefix || '',
          context: options.context
        });
      }
    }));
  }

  if (options.import !== false) {
    plugins.push((0, _plugins.importParser)({
      filter: (0, _utils.getFilter)(options.import, this.resourcePath)
    }));
  }

  if (options.url !== false) {
    plugins.push((0, _plugins.urlParser)({
      filter: (0, _utils.getFilter)(options.url, this.resourcePath, value => (0, _loaderUtils.isUrlRequest)(value))
    }));
  }

  plugins.push((0, _plugins.icssParser)());
  (0, _postcss.default)(plugins).process(content, {
    from: (0, _loaderUtils.getRemainingRequest)(this).split('!').pop(),
    to: (0, _loaderUtils.getCurrentRequest)(this).split('!').pop(),
    map: options.sourceMap ? {
      prev: map,
      inline: false,
      annotation: false
    } : null
  }).then(result => {
    result.warnings().forEach(warning => this.emitWarning(new _Warning.default(warning)));
    const messages = result.messages || []; // Run other loader (`postcss-loader`, `sass-loader` and etc) for importing CSS

    const importUrlPrefix = (0, _utils.getImportPrefix)(this, options.importLoaders); // Prepare replacer to change from `___CSS_LOADER_IMPORT___INDEX___` to `require('./file.css').locals`

    const importItemReplacer = placeholder => {
      const match = _utils.placholderRegExps.importItem.exec(placeholder);

      const idx = Number(match[1]);
      const message = messages.find( // eslint-disable-next-line no-shadow
      message => message.type === 'icss-import' && message.item && message.item.index === idx);

      if (!message) {
        return placeholder;
      }

      const {
        item
      } = message;
      const importUrl = importUrlPrefix + (0, _loaderUtils.urlToRequest)(item.url);

      if (options.exportOnlyLocals) {
        return `" + require(${(0, _loaderUtils.stringifyRequest)(this, importUrl)})[${JSON.stringify(item.export)}] + "`;
      }

      return `" + require(${(0, _loaderUtils.stringifyRequest)(this, importUrl)}).locals[${JSON.stringify(item.export)}] + "`;
    };

    const exports = messages.filter(message => message.type === 'export').reduce((accumulator, message) => {
      const {
        key,
        value
      } = message.item;
      let valueAsString = JSON.stringify(value);
      valueAsString = valueAsString.replace(_utils.placholderRegExps.importItemG, importItemReplacer);

      function addEntry(k) {
        accumulator.push(`\t${JSON.stringify(k)}: ${valueAsString}`);
      }

      let targetKey;

      switch (options.camelCase) {
        case true:
          addEntry(key);
          targetKey = (0, _utils.camelCase)(key);

          if (targetKey !== key) {
            addEntry(targetKey);
          }

          break;

        case 'dashes':
          addEntry(key);
          targetKey = (0, _utils.dashesCamelCase)(key);

          if (targetKey !== key) {
            addEntry(targetKey);
          }

          break;

        case 'only':
          addEntry((0, _utils.camelCase)(key));
          break;

        case 'dashesOnly':
          addEntry((0, _utils.dashesCamelCase)(key));
          break;

        default:
          addEntry(key);
          break;
      }

      return accumulator;
    }, []);

    if (options.exportOnlyLocals) {
      return callback(null, exports.length > 0 ? `module.exports = {\n${exports.join(',\n')}\n};` : '');
    }

    const imports = messages.filter(message => message.type === 'import').map(message => {
      const {
        url
      } = message.item;
      const media = message.item.media || '';

      if (!(0, _loaderUtils.isUrlRequest)(url)) {
        return `exports.push([module.id, ${JSON.stringify(`@import url(${url});`)}, ${JSON.stringify(media)}]);`;
      }

      const importUrl = importUrlPrefix + (0, _loaderUtils.urlToRequest)(url);
      return `exports.i(require(${(0, _loaderUtils.stringifyRequest)(this, importUrl)}), ${JSON.stringify(media)});`;
    }, this);
    let cssAsString = JSON.stringify(result.css).replace(_utils.placholderRegExps.importItemG, importItemReplacer); // Helper for ensuring valid CSS strings from requires

    let hasUrlEscapeHelper = false;
    messages.filter(message => message.type === 'url').forEach(message => {
      if (!hasUrlEscapeHelper) {
        imports.push(`var urlEscape = require(${(0, _loaderUtils.stringifyRequest)(this, require.resolve('./runtime/url-escape.js'))});`);
        hasUrlEscapeHelper = true;
      }

      const {
        item
      } = message;
      const {
        url,
        placeholder,
        needQuotes
      } = item; // Remove `#hash` and `?#hash` from `require`

      const [normalizedUrl, singleQuery, hashValue] = url.split(/(\?)?#/);
      const hash = singleQuery || hashValue ? `"${singleQuery ? '?' : ''}${hashValue ? `#${hashValue}` : ''}"` : '';
      imports.push(`var ${placeholder} = urlEscape(require(${(0, _loaderUtils.stringifyRequest)(this, (0, _loaderUtils.urlToRequest)(normalizedUrl))})${hash ? ` + ${hash}` : ''}${needQuotes ? ', true' : ''});`);
      cssAsString = cssAsString.replace(new RegExp(placeholder, 'g'), () => `" + ${placeholder} + "`);
    });
    const runtimeCode = `exports = module.exports = require(${(0, _loaderUtils.stringifyRequest)(this, require.resolve('./runtime/api'))})(${!!sourceMap});\n`;
    const importCode = imports.length > 0 ? `// Imports\n${imports.join('\n')}\n\n` : '';
    const moduleCode = `// Module\nexports.push([module.id, ${cssAsString}, ""${result.map ? `,${result.map}` : ''}]);\n\n`;
    const exportsCode = exports.length > 0 ? `// Exports\nexports.locals = {\n${exports.join(',\n')}\n};` : ''; // Embed runtime

    return callback(null, runtimeCode + importCode + moduleCode + exportsCode);
  }).catch(error => {
    callback(error.name === 'CssSyntaxError' ? new _CssSyntaxError.default(error) : error);
  });
}