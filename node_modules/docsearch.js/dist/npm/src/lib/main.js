'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toFactory = require('to-factory');

var _toFactory2 = _interopRequireDefault(_toFactory);

var _DocSearch = require('./DocSearch');

var _DocSearch2 = _interopRequireDefault(_DocSearch);

var _version = require('./version');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var docsearch = (0, _toFactory2.default)(_DocSearch2.default);
docsearch.version = _version2.default;

exports.default = docsearch;