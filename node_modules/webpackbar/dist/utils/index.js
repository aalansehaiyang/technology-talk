'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.first = first;
exports.last = last;
exports.startCase = startCase;
exports.firstMatch = firstMatch;
exports.hasValue = hasValue;
exports.removeAfter = removeAfter;
exports.removeBefore = removeBefore;
exports.range = range;
exports.shortenPath = shortenPath;
exports.objectValues = objectValues;

var _path = require('path');

function first(arr) {
  return arr[0];
}

function last(arr) {
  return arr.length ? arr[arr.length - 1] : null;
}

function startCase(str) {
  return str[0].toUpperCase() + str.substr(1);
}

function firstMatch(regex, str) {
  const m = regex.exec(str);
  return m ? m[0] : null;
}

function hasValue(s) {
  return s && s.length;
}

function removeAfter(delimiter, str) {
  return first(str.split(delimiter)) || '';
}

function removeBefore(delimiter, str) {
  return last(str.split(delimiter)) || '';
}

function range(len) {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
}

function shortenPath(path = '') {
  const cwd = process.cwd() + _path.sep;
  return String(path).replace(cwd, '');
}

function objectValues(obj) {
  return Object.keys(obj).map(key => obj[key]);
}