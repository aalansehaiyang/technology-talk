(function (root, stringify) {
  /* istanbul ignore else */
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    // Node.
    module.exports = stringify();
  } else if (typeof define === 'function' && define.amd) {
    // AMD, registers as an anonymous module.
    define(function () {
      return stringify();
    });
  } else {
    // Browser global.
    root.javascriptStringify = stringify();
  }
})(this, function () {
  /**
   * Match all characters that need to be escaped in a string. Modified from
   * source to match single quotes instead of double.
   *
   * Source: https://github.com/douglascrockford/JSON-js/blob/master/json2.js
   */
  var ESCAPABLE = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  /**
   * Map of characters to escape characters.
   */
  var META_CHARS = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    "'":  "\\'",
    '"':  '\\"',
    '\\': '\\\\'
  };

  /**
   * Escape any character into its literal JavaScript string.
   *
   * @param  {string} char
   * @return {string}
   */
  function escapeChar (char) {
    var meta = META_CHARS[char];

    return meta || '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
  };

  /**
   * JavaScript reserved word list.
   */
  var RESERVED_WORDS = {};

  /**
   * Map reserved words to the object.
   */
  (
    'break else new var case finally return void catch for switch while ' +
    'continue function this with default if throw delete in try ' +
    'do instanceof typeof abstract enum int short boolean export ' +
    'interface static byte extends long super char final native synchronized ' +
    'class float package throws const goto private transient debugger ' +
    'implements protected volatile double import public let yield'
  ).split(' ').map(function (key) {
    RESERVED_WORDS[key] = true;
  });

  /**
   * Test for valid JavaScript identifier.
   */
  var IS_VALID_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

  /**
   * Check if a variable name is valid.
   *
   * @param  {string}  name
   * @return {boolean}
   */
  function isValidVariableName (name) {
    return !RESERVED_WORDS[name] && IS_VALID_IDENTIFIER.test(name);
  }

  /**
   * Return the global variable name.
   *
   * @return {string}
   */
  function toGlobalVariable (value) {
    return 'Function(' + stringify('return this;') + ')()';
  }

  /**
   * Serialize the path to a string.
   *
   * @param  {Array}  path
   * @return {string}
   */
  function toPath (path) {
    var result = '';

    for (var i = 0; i < path.length; i++) {
      if (isValidVariableName(path[i])) {
        result += '.' + path[i];
      } else {
        result += '[' + stringify(path[i]) + ']';
      }
    }

    return result;
  }

  /**
   * Stringify an array of values.
   *
   * @param  {Array}    array
   * @param  {string}   indent
   * @param  {Function} next
   * @return {string}
   */
  function stringifyArray (array, indent, next) {
    // Map array values to their stringified values with correct indentation.
    var values = array.map(function (value, index) {
      var str = next(value, index);

      if (str === undefined) {
        return String(str);
      }

      return indent + str.split('\n').join('\n' + indent);
    }).join(indent ? ',\n' : ',');

    // Wrap the array in newlines if we have indentation set.
    if (indent && values) {
      return '[\n' + values + '\n]';
    }

    return '[' + values + ']';
  }

  /**
   * Stringify a map of values.
   *
   * @param  {Object}   object
   * @param  {string}   indent
   * @param  {Function} next
   * @return {string}
   */
  function stringifyObject (object, indent, next) {
    // Iterate over object keys and concat string together.
    var values = Object.keys(object).reduce(function (values, key) {
      var value = next(object[key], key);

      // Omit `undefined` object values.
      if (value === undefined) {
        return values;
      }

      // String format the key and value data.
      key   = isValidVariableName(key) ? key : stringify(key);
      value = String(value).split('\n').join('\n' + indent);

      // Push the current object key and value into the values array.
      values.push(indent + key + ':' + (indent ? ' ' : '') + value);

      return values;
    }, []).join(indent ? ',\n' : ',');

    // Wrap the object in newlines if we have indentation set.
    if (indent && values) {
      return '{\n' + values + '\n}';
    }

    return '{' + values + '}';
  }

  /**
   * Convert JavaScript objects into strings.
   */
  var OBJECT_TYPES = {
    '[object Array]': stringifyArray,
    '[object Object]': stringifyObject,
    '[object Error]': function (error) {
      return 'new Error(' + stringify(error.message) + ')';
    },
    '[object Date]': function (date) {
      return 'new Date(' + date.getTime() + ')';
    },
    '[object String]': function (string) {
      return 'new String(' + stringify(string.toString()) + ')';
    },
    '[object Number]': function (number) {
      return 'new Number(' + number + ')';
    },
    '[object Boolean]': function (boolean) {
      return 'new Boolean(' + boolean + ')';
    },
    '[object Uint8Array]': function (array, indent) {
      return 'new Uint8Array(' + stringifyArray(array) + ')';
    },
    '[object Set]': function (array, indent, next) {
      if (typeof Array.from === 'function') {
        return 'new Set(' + stringify(Array.from(array), indent, next) + ')';
      } else return undefined;
    },
    '[object Map]': function (array, indent, next) {
      if (typeof Array.from === 'function') {
        return 'new Map(' + stringify(Array.from(array), indent, next) + ')';
      } else return undefined;
    },
    '[object RegExp]': String,
    '[object Function]': String,
    '[object global]': toGlobalVariable,
    '[object Window]': toGlobalVariable
  };

  /**
   * Convert JavaScript primitives into strings.
   */
  var PRIMITIVE_TYPES = {
    'string': function (string) {
      return "'" + string.replace(ESCAPABLE, escapeChar) + "'";
    },
    'number': String,
    'object': String,
    'boolean': String,
    'symbol': String,
    'undefined': String
  };

  /**
   * Convert any value to a string.
   *
   * @param  {*}        value
   * @param  {string}   indent
   * @param  {Function} next
   * @return {string}
   */
  function stringify (value, indent, next) {
    // Convert primitives into strings.
    if (Object(value) !== value) {
      return PRIMITIVE_TYPES[typeof value](value, indent, next);
    }

    // Handle buffer objects before recursing (node < 6 was an object, node >= 6 is a `Uint8Array`).
    if (typeof Buffer === 'function' && Buffer.isBuffer(value)) {
      return 'new Buffer(' + next(value.toString()) + ')';
    }

    // Use the internal object string to select stringification method.
    var toString = OBJECT_TYPES[Object.prototype.toString.call(value)];

    // Convert objects into strings.
    return toString ? toString(value, indent, next) : undefined;
  }

  /**
   * Stringify an object into the literal string.
   *
   * @param  {*}               value
   * @param  {Function}        [replacer]
   * @param  {(number|string)} [space]
   * @param  {Object}          [options]
   * @return {string}
   */
  return function (value, replacer, space, options) {
    options = options || {}

    // Convert the spaces into a string.
    if (typeof space !== 'string') {
      space = new Array(Math.max(0, space|0) + 1).join(' ');
    }

    var maxDepth = Number(options.maxDepth) || 100;
    var references = !!options.references;
    var skipUndefinedProperties = !!options.skipUndefinedProperties;
    var valueCount = Number(options.maxValues) || 100000;

    var path = [];
    var stack = [];
    var encountered = [];
    var paths = [];
    var restore = [];

    /**
     * Stringify the next value in the stack.
     *
     * @param  {*}      value
     * @param  {string} key
     * @return {string}
     */
    function next (value, key) {
      if (skipUndefinedProperties && value === undefined) {
        return undefined;
      }

      path.push(key);
      var result = recurse(value, stringify);
      path.pop();
      return result;
    }

    /**
     * Handle recursion by checking if we've visited this node every iteration.
     *
     * @param  {*}        value
     * @param  {Function} stringify
     * @return {string}
     */
    var recurse = references ?
      function (value, stringify) {
        if (value && (typeof value === 'object' || typeof value === 'function')) {
          var seen = encountered.indexOf(value);

          // Track nodes to restore later.
          if (seen > -1) {
            restore.push(path.slice(), paths[seen]);
            return;
          }

          // Track encountered nodes.
          encountered.push(value);
          paths.push(path.slice());
        }

        // Stop when we hit the max depth.
        if (path.length > maxDepth || valueCount-- <= 0) {
          return;
        }

        // Stringify the value and fallback to
        return stringify(value, space, next);
      } :
      function (value, stringify) {
        var seen = stack.indexOf(value);

        if (seen > -1 || path.length > maxDepth || valueCount-- <= 0) {
          return;
        }

        stack.push(value);
        var value = stringify(value, space, next);
        stack.pop();
        return value;
      };

    // If the user defined a replacer function, make the recursion function
    // a double step process - `recurse -> replacer -> stringify`.
    if (typeof replacer === 'function') {
      var before = recurse

      // Intertwine the replacer function with the regular recursion.
      recurse = function (value, stringify) {
        return before(value, function (value, space, next) {
          return replacer(value, space, function (value) {
            return stringify(value, space, next);
          });
        });
      };
    }

    var result = recurse(value, stringify);

    // Attempt to restore circular references.
    if (restore.length) {
      var sep = space ? '\n' : '';
      var assignment = space ? ' = ' : '=';
      var eol = ';' + sep;
      var before = space ? '(function () {' : '(function(){'
      var after = '}())'
      var results = ['var x' + assignment + result];

      for (var i = 0; i < restore.length; i += 2) {
        results.push('x' + toPath(restore[i]) + assignment + 'x' + toPath(restore[i + 1]));
      }

      results.push('return x');

      return before + sep + results.join(eol) + eol + after
    }

    return result;
  };
});
