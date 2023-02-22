# JavaScript Stringify

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Stringify is to `eval` as `JSON.stringify` is to `JSON.parse`.

## Installation

```javascript
npm install javascript-stringify --save
bower install javascript-stringify --save
```

### Node

```javascript
var javascriptStringify = require('javascript-stringify');
```

### AMD

```javascript
define(function (require, exports, module) {
  var javascriptStringify = require('javascript-stringify');
});
```

### `<script>` tag

```html
<script src="javascript-stringify.js"></script>
```

## Usage

```javascript
javascriptStringify(value[, replacer [, space [, options]]])
```

The API is similar to `JSON.stringify`. However, any value returned by the replacer will be used literally. For this reason, the replacer is passed three arguments - `value`, `indentation` and `stringify`. If you need to continue the stringification process inside your replacer, you can call `stringify(value)` with the new value.

The `options` object allows some additional configuration:

* **maxDepth** _(number, default: 100)_ The maximum depth of values to stringify
* **maxValues** _(number, default: 100000)_ The maximum number of values to stringify
* **references** _(boolean, default: false)_ Restore circular/repeated references in the object (uses IIFE)
* **skipUndefinedProperties** _(boolean, default: false)_ Omits `undefined` properties instead of restoring as `undefined`

### Examples

```javascript
javascriptStringify({});    // "{}"
javascriptStringify(true);  // "true"
javascriptStringify('foo'); // "'foo'"

javascriptStringify({ x: 5, y: 6});       // "{x:5,y:6}"
javascriptStringify([1, 2, 3, 'string']); // "[1,2,3,'string']"

javascriptStringify({ a: { b: { c: 1 } } }, null, null, { maxDepth: 2 }); // "{a:{b:{}}}"

/**
 * Invalid key names are automatically stringified.
 */

javascriptStringify({ 'some-key': 10 }); // "{'some-key':10}"

/**
 * Some object types and values can remain identical.
 */

javascriptStringify([/.+/ig, new Number(10), new Date()]); // "[/.+/gi,new Number(10),new Date(1406623295732)]"

/**
 * Unknown or circular references are removed.
 */

var obj = { x: 10 };
obj.circular = obj;

javascriptStringify(obj); // "{x:10}"
javascriptStringify(obj, null, null, { references: true }); // "(function(){var x={x:10};x.circular=x;return x;}())"

/**
 * Specify indentation - just like `JSON.stringify`.
 */

javascriptStringify({ a: 2 }, null, ' ');             // "{\n a: 2\n}"
javascriptStringify({ uno: 1, dos : 2 }, null, '\t'); // "{\n\tuno: 1,\n\tdos: 2\n}"

/**
 * Add custom replacer behaviour - like double quoted strings.
 */

javascriptStringify(['test', 'string'], function (value, indent, stringify) {
  if (typeof value === 'string') {
    return '"' + value.replace(/"/g, '\\"') + '"';
  }

  return stringify(value);
});
//=> '["test","string"]'
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/javascript-stringify.svg?style=flat
[npm-url]: https://npmjs.org/package/javascript-stringify
[downloads-image]: https://img.shields.io/npm/dm/javascript-stringify.svg?style=flat
[downloads-url]: https://npmjs.org/package/javascript-stringify
[travis-image]: https://img.shields.io/travis/blakeembrey/javascript-stringify.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/javascript-stringify
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/javascript-stringify.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/javascript-stringify?branch=master
