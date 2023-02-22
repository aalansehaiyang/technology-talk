# std-env

[![npm](https://img.shields.io/npm/dt/std-env.svg?style=flat-square)](http://npmjs.com/package/std-env)
[![npm](https://img.shields.io/npm/v/std-env.svg?style=flat-square)](http://npmjs.com/package/std-env)

Detect running environment of the current Node.js process.

## Installation

Using Yarn:

```
yarn add std-env
```

Using npm:

```
npm i std-env
```

## Usage

```js
const env = require('std-env')

console.log(env)

/*
{
  browser: false,
  test: false,
  dev: true,
  production: false,
  debug: false,
  ci: false,
  tty: true,
  minimalCLI: false,
  windows: false,
  darwin: true,
  linux: false
}
*/
```

## License

MIT
