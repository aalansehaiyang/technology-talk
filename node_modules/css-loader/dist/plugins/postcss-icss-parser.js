"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

var _postcssValueParser = _interopRequireDefault(require("postcss-value-parser"));

var _icssUtils = require("icss-utils");

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pluginName = 'postcss-icss-parser';

var _default = _postcss.default.plugin(pluginName, () => function process(css, result) {
  const imports = {};
  const icss = (0, _icssUtils.extractICSS)(css);
  const exports = icss.icssExports;
  Object.keys(icss.icssImports).forEach(key => {
    const url = _loaderUtils.default.parseString(key);

    Object.keys(icss.icssImports[key]).forEach(prop => {
      const index = Object.keys(imports).length;
      imports[`$${prop}`] = index;
      result.messages.push({
        pluginName,
        type: 'icss-import',
        item: {
          url,
          export: icss.icssImports[key][prop],
          index
        }
      });
      const alreadyIncluded = result.messages.find(message => message.pluginName === pluginName && message.type === 'import' && message.item.url === url && message.item.media === '');

      if (alreadyIncluded) {
        return;
      }

      result.messages.push({
        pluginName,
        type: 'import',
        item: {
          url,
          media: ''
        }
      });
    });
  });

  function replaceImportsInString(str) {
    const tokens = (0, _postcssValueParser.default)(str);
    tokens.walk(node => {
      if (node.type !== 'word') {
        return;
      }

      const token = node.value;
      const importIndex = imports[`$${token}`];

      if (typeof importIndex === 'number') {
        // eslint-disable-next-line no-param-reassign
        node.value = `___CSS_LOADER_IMPORT___${importIndex}___`;
      }
    });
    return tokens.toString();
  } // Replace tokens in declarations


  css.walkDecls(decl => {
    // eslint-disable-next-line no-param-reassign
    decl.value = replaceImportsInString(decl.value.toString());
  }); // Replace tokens in at-rules

  css.walkAtRules(atrule => {
    // Due reusing `ast` from `postcss-loader` some plugins may lack
    // `params` property, we need to account for this possibility
    if (atrule.params) {
      // eslint-disable-next-line no-param-reassign
      atrule.params = replaceImportsInString(atrule.params.toString());
    }
  }); // Replace tokens in export

  Object.keys(exports).forEach(exportName => {
    result.messages.push({
      pluginName,
      type: 'export',
      item: {
        key: exportName,
        value: replaceImportsInString(exports[exportName])
      }
    });
  });
});

exports.default = _default;