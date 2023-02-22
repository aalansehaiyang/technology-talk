# buffer-json

```
npm install buffer-json
```

```js
const BJSON = require('buffer-json')

const str = BJSON.stringify({ buf: Buffer.from('hello') })
// => '{"buf":{"type":"Buffer","data":"base64:aGVsbG8="}}'

BJSON.parse(str)
// => { buf: <Buffer 68 65 6c 6c 6f> }
```

The [`Buffer`](https://nodejs.org/api/buffer.html#buffer_buffer) class in Node.js is used to represent binary data. JSON does not specify a way to encode binary data, so the Node.js implementation of `JSON.stringify` represents buffers as an object of shape `{ type: "Buffer", data: [<bytes as numbers>] }`. Unfortunately, `JSON.parse` does not turn this structure back into a `Buffer` object:

```
$ node
> JSON.parse(JSON.stringify({ buf: Buffer.from('hello world') }))
{ buf:
   { type: 'Buffer',
     data: [ 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100 ] } }
```

`JSON.stringify` and `JSON.parse` accept arguments called [`replacer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter) and [`reviver`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter) respectively which allow customizing the parsing/encoding behavior. This module provides a replacer which encodes Buffer data as a base64-encoded string, and a reviver which turns JSON objects which contain buffer-like data (either as arrays of numbers or strings) into `Buffer` instances. All other types of values are parsed/encoded as normal.

## API

### `stringify(value[, space])`

Convenience wrapper for [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) with the `replacer` described below.

### `parse(text)`

Convenience wrapper for [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) with the `reviver` described below.

### `replacer(key, value)`

A [`replacer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter) implementation which turns every value that is a `Buffer` instance into an object of shape `{ type: 'Buffer', data: 'base64:<base64-encoded buffer content>' }`. Empty buffers are encoded as `{ type: 'Buffer', data: '' }`.

### `reviver(key, value)`

A [`reviver`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter) implementation which turns every object of shape `{ type: 'Buffer', data: <array of numbers or string> }` into a `Buffer` instance.

## Related modules

- [`buffer-json-encoding`](https://github.com/lachenmayer/buffer-json-encoding): an [`abstract-encoding`](https://github.com/mafintosh/abstract-encoding) compatible JSON encoder/decoder which uses this module.

## License

MIT