'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDescription;

var _utils = require('../utils');

const DB = {
  loader: {
    get: loader => (0, _utils.startCase)(loader)
  },
  ext: {
    get: ext => `${ext} files`,
    vue: 'Vue Single File components',
    js: 'JavaScript files',
    sass: 'SASS files',
    scss: 'SASS files',
    unknown: 'Unknown files'
  }
};

function getDescription(category, keyword) {
  if (!DB[category]) {
    return (0, _utils.startCase)(keyword);
  }

  if (DB[category][keyword]) {
    return DB[category][keyword];
  }

  if (DB[category].get) {
    return DB[category].get(keyword);
  }

  return '-';
}