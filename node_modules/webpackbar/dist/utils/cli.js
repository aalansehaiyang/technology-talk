'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderBar = exports.colorize = exports.consola = undefined;
exports.createTable = createTable;
exports.ellipsis = ellipsis;
exports.ellipsisLeft = ellipsisLeft;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _consola = require('consola');

var _consola2 = _interopRequireDefault(_consola);

var _textTable = require('text-table');

var _textTable2 = _interopRequireDefault(_textTable);

var _consts = require('./consts');

var _ = require('.');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const consola = exports.consola = _consola2.default.withTag('webpackbar');

const colorize = exports.colorize = color => {
  if (color[0] === '#') {
    return _chalk2.default.hex(color);
  }

  return _chalk2.default[color] || _chalk2.default.keyword(color);
};

const renderBar = exports.renderBar = (progress, color) => {
  const w = progress * (_consts.BAR_LENGTH / 100);
  const bg = _chalk2.default.white(_consts.BLOCK_CHAR);
  const fg = colorize(color)(_consts.BLOCK_CHAR2);

  return (0, _.range)(_consts.BAR_LENGTH).map(i => i < w ? fg : bg).join('');
};

function createTable(data) {
  return (0, _textTable2.default)(data, {
    align: data[0].map(() => 'l')
  }).replace(/\n/g, '\n\n');
}

function ellipsis(str, n) {
  if (str.length <= n - 3) {
    return str;
  }
  return `${str.substr(0, n - 1)}...`;
}

function ellipsisLeft(str, n) {
  if (str.length <= n - 3) {
    return str;
  }
  return `...${str.substr(str.length - n - 1)}`;
}