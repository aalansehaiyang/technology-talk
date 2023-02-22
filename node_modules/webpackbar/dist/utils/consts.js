'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CIRCLE_OPEN = exports.CROSS = exports.TICK = exports.BULLET = exports.NEXT = exports.BLOCK_CHAR2 = exports.BLOCK_CHAR = exports.BAR_LENGTH = exports.nodeModules = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _figures = require('figures');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nodeModules = exports.nodeModules = `${_path2.default.delimiter}node_modules${_path2.default.delimiter}`;
const BAR_LENGTH = exports.BAR_LENGTH = 25;
const BLOCK_CHAR = exports.BLOCK_CHAR = '█';
const BLOCK_CHAR2 = exports.BLOCK_CHAR2 = '█';
const NEXT = exports.NEXT = ' ' + _chalk2.default.blue(_figures.pointerSmall) + ' ';
const BULLET = exports.BULLET = _figures.bullet;
const TICK = exports.TICK = _figures.tick;
const CROSS = exports.CROSS = _figures.cross;
const CIRCLE_OPEN = exports.CIRCLE_OPEN = _figures.radioOff;