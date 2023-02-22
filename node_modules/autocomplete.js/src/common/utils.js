'use strict';

var DOM = require('./dom.js');

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

module.exports = {
  // those methods are implemented differently
  // depending on which build it is, using
  // $... or angular... or Zepto... or require(...)
  isArray: null,
  isFunction: null,
  isObject: null,
  bind: null,
  each: null,
  map: null,
  mixin: null,

  isMsie: function(agentString) {
    if (agentString === undefined) { agentString = navigator.userAgent; }
    // from https://github.com/ded/bowser/blob/master/bowser.js
    if ((/(msie|trident)/i).test(agentString)) {
      var match = agentString.match(/(msie |rv:)(\d+(.\d+)?)/i);
      if (match) { return match[2]; }
    }
    return false;
  },

  // http://stackoverflow.com/a/6969486
  escapeRegExChars: function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  },

  isNumber: function(obj) { return typeof obj === 'number'; },

  toStr: function toStr(s) {
    return s === undefined || s === null ? '' : s + '';
  },

  cloneDeep: function cloneDeep(obj) {
    var clone = this.mixin({}, obj);
    var self = this;
    this.each(clone, function(value, key) {
      if (value) {
        if (self.isArray(value)) {
          clone[key] = [].concat(value);
        } else if (self.isObject(value)) {
          clone[key] = self.cloneDeep(value);
        }
      }
    });
    return clone;
  },

  error: function(msg) {
    throw new Error(msg);
  },

  every: function(obj, test) {
    var result = true;
    if (!obj) {
      return result;
    }
    this.each(obj, function(val, key) {
      if (result) {
        result = test.call(null, val, key, obj) && result;
      }
    });
    return !!result;
  },

  any: function(obj, test) {
    var found = false;
    if (!obj) {
      return found;
    }
    this.each(obj, function(val, key) {
      if (test.call(null, val, key, obj)) {
        found = true;
        return false;
      }
    });
    return found;
  },

  getUniqueId: (function() {
    var counter = 0;
    return function() { return counter++; };
  })(),

  templatify: function templatify(obj) {
    if (this.isFunction(obj)) {
      return obj;
    }
    var $template = DOM.element(obj);
    if ($template.prop('tagName') === 'SCRIPT') {
      return function template() { return $template.text(); };
    }
    return function template() { return String(obj); };
  },

  defer: function(fn) { setTimeout(fn, 0); },

  noop: function() {},

  formatPrefix: function(prefix, noPrefix) {
    return noPrefix ? '' : prefix + '-';
  },

  className: function(prefix, clazz, skipDot) {
    return (skipDot ? '' : '.') + prefix + clazz;
  },

  escapeHighlightedString: function(str, highlightPreTag, highlightPostTag) {
    highlightPreTag = highlightPreTag || '<em>';
    var pre = document.createElement('div');
    pre.appendChild(document.createTextNode(highlightPreTag));

    highlightPostTag = highlightPostTag || '</em>';
    var post = document.createElement('div');
    post.appendChild(document.createTextNode(highlightPostTag));

    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML
      .replace(RegExp(escapeRegExp(pre.innerHTML), 'g'), highlightPreTag)
      .replace(RegExp(escapeRegExp(post.innerHTML), 'g'), highlightPostTag);
  }
};
