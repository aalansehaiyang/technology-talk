'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatRequest = exports.parseRequest = undefined;
exports.hook = hook;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _consts = require('./consts');

var _ = require('.');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const parseRequest = exports.parseRequest = requestStr => {
  const parts = (requestStr || '').split('!');

  const file = _path2.default.relative(process.cwd(), (0, _.removeAfter)('?', (0, _.removeBefore)(_consts.nodeModules, parts.pop())));

  const loaders = parts.map(part => (0, _.firstMatch)(/[a-z0-9-@]+-loader/, part)).filter(_.hasValue);

  return {
    file: (0, _.hasValue)(file) ? file : null,
    loaders
  };
};

const formatRequest = exports.formatRequest = request => {
  const loaders = request.loaders.join(_consts.NEXT);

  if (!loaders.length) {
    return request.file || '';
  }

  return `${loaders}${_consts.NEXT}${request.file}`;
};

// Hook helper for webpack 3 + 4 support
function hook(compiler, hookName, fn) {
  if (compiler.hooks) {
    compiler.hooks[hookName].tap('WebpackBar:' + hookName, fn);
  } else {
    compiler.plugin(hookName, fn);
  }
}