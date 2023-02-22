"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

var _postcssValueParser = _interopRequireDefault(require("postcss-value-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pluginName = 'postcss-import-parser';

function getArg(nodes) {
  return nodes.length !== 0 && nodes[0].type === 'string' ? nodes[0].value : _postcssValueParser.default.stringify(nodes);
}

function getUrl(node) {
  if (node.type === 'function' && node.value.toLowerCase() === 'url') {
    return getArg(node.nodes);
  }

  if (node.type === 'string') {
    return node.value;
  }

  return null;
}

function parseImport(params) {
  const {
    nodes
  } = (0, _postcssValueParser.default)(params);

  if (nodes.length === 0) {
    return null;
  }

  const url = getUrl(nodes[0]);

  if (!url || url.trim().length === 0) {
    return null;
  }

  return {
    url,
    media: _postcssValueParser.default.stringify(nodes.slice(1)).trim().toLowerCase()
  };
}

function walkAtRules(css, result, filter) {
  const items = [];
  css.walkAtRules(/^import$/i, atRule => {
    // Convert only top-level @import
    if (atRule.parent.type !== 'root') {
      return;
    }

    if (atRule.nodes) {
      result.warn("It looks like you didn't end your @import statement correctly. " + 'Child nodes are attached to it.', {
        node: atRule
      });
      return;
    }

    const parsed = parseImport(atRule.params);

    if (!parsed) {
      // eslint-disable-next-line consistent-return
      return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
        node: atRule
      });
    }

    if (filter && !filter(parsed)) {
      return;
    }

    atRule.remove();
    const {
      url,
      media
    } = parsed;
    items.push({
      url,
      media
    });
  });
  return items;
}

function uniq(array) {
  return array.reduce((acc, d) => !acc.find(el => el.url === d.url && el.media === d.media) ? [...acc, d] : acc, []);
}

var _default = _postcss.default.plugin(pluginName, (options = {}) => function process(css, result) {
  const traversed = walkAtRules(css, result, options.filter);
  const paths = uniq(traversed);
  paths.forEach(item => {
    result.messages.push({
      pluginName,
      type: 'import',
      item
    });
  });
});

exports.default = _default;