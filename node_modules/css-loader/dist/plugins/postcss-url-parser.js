"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

var _postcssValueParser = _interopRequireDefault(require("postcss-value-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pluginName = 'postcss-url-parser';
const isUrlFunc = /url/i;
const isImageSetFunc = /^(?:-webkit-)?image-set$/i;
const needParseDecl = /(?:url|(?:-webkit-)?image-set)\(/i;

function getNodeFromUrlFunc(node) {
  return node.nodes && node.nodes[0];
}

function getUrlFromUrlFunc(node) {
  return node.nodes.length !== 0 && node.nodes[0].type === 'string' ? node.nodes[0].value : _postcssValueParser.default.stringify(node.nodes);
}

function walkUrls(parsed, callback) {
  parsed.walk(node => {
    if (node.type !== 'function') {
      return;
    }

    if (isUrlFunc.test(node.value)) {
      callback(getNodeFromUrlFunc(node), getUrlFromUrlFunc(node), false); // Do not traverse inside `url`
      // eslint-disable-next-line consistent-return

      return false;
    }

    if (isImageSetFunc.test(node.value)) {
      node.nodes.forEach(nNode => {
        if (nNode.type === 'function' && isUrlFunc.test(nNode.value)) {
          callback(getNodeFromUrlFunc(nNode), getUrlFromUrlFunc(nNode), false);
        }

        if (nNode.type === 'string') {
          callback(nNode, nNode.value, true);
        }
      }); // Do not traverse inside `image-set`
      // eslint-disable-next-line consistent-return

      return false;
    }
  });
}

function walkDeclsWithUrl(css, result, filter) {
  const items = [];
  css.walkDecls(decl => {
    if (!needParseDecl.test(decl.value)) {
      return;
    }

    const parsed = (0, _postcssValueParser.default)(decl.value);
    const urls = [];
    walkUrls(parsed, (node, url, needQuotes) => {
      if (url.trim().replace(/\\[\r\n]/g, '').length === 0) {
        result.warn(`Unable to find uri in '${decl.toString()}'`, {
          node: decl
        });
        return;
      }

      if (filter && !filter(url)) {
        return;
      }

      urls.push({
        url,
        needQuotes
      });
    });

    if (urls.length === 0) {
      return;
    }

    items.push({
      decl,
      parsed,
      urls
    });
  });
  return items;
}

function uniqWith(array, comparator) {
  return array.reduce((acc, d) => !acc.some(item => comparator(d, item)) ? [...acc, d] : acc, []);
}

function flatten(array) {
  return array.reduce((a, b) => a.concat(b), []);
}

function isEqual(value, other) {
  return value.url === other.url && value.needQuotes === other.needQuotes;
}

var _default = _postcss.default.plugin(pluginName, (options = {}) => function process(css, result) {
  const traversed = walkDeclsWithUrl(css, result, options.filter);
  const paths = uniqWith(flatten(traversed.map(item => item.urls)), isEqual);

  if (paths.length === 0) {
    return;
  }

  const placeholders = [];
  paths.forEach((path, index) => {
    const placeholder = `___CSS_LOADER_URL___${index}___`;
    const {
      url,
      needQuotes
    } = path;
    placeholders.push({
      placeholder,
      path
    });
    result.messages.push({
      pluginName,
      type: 'url',
      item: {
        url,
        placeholder,
        needQuotes
      }
    });
  });
  traversed.forEach(item => {
    walkUrls(item.parsed, (node, url, needQuotes) => {
      const value = placeholders.find(placeholder => placeholder.path.url === url && placeholder.path.needQuotes === needQuotes);

      if (!value) {
        return;
      }

      const {
        placeholder
      } = value; // eslint-disable-next-line no-param-reassign

      node.type = 'word'; // eslint-disable-next-line no-param-reassign

      node.value = placeholder;
    }); // eslint-disable-next-line no-param-reassign

    item.decl.value = item.parsed.toString();
  });
});

exports.default = _default;