<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# file-loader

The `file-loader` resolves `import`/`require()` on a file into a url and emits the file into the output directory.

## Getting Started

To begin, you'll need to install `file-loader`:

```console
$ npm install file-loader --save-dev
```

Import (or `require`) the target file(s) in one of the bundle's files:

**file.js**

```js
import img from './file.png';
```

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
};
```

And run `webpack` via your preferred method. This will emit `file.png` as a file
in the output directory (with the specified naming convention, if options are
specified to do so) and returns the public URI of the file.

> ℹ️ By default the filename of the resulting file is the hash of the file's contents with the original extension of the required resource.

## Options

### `name`

Type: `String|Function`
Default: `'[hash].[ext]'`

Specifies a custom filename template for the target file(s) using the query
parameter `name`. For example, to emit a file from your `context` directory into
the output directory retaining the full directory structure, you might use:

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name(file) {
            if (process.env.NODE_ENV === 'development') {
              return '[path][name].[ext]';
            }

            return '[hash].[ext]';
          },
        },
      },
    ],
  },
};
```

> ℹ️ By default the path and name you specify will output the file in that same directory, and will also use the same URI path to access the file.

### `outputPath`

Type: `String|Function`
Default: `undefined`

Specify a filesystem path where the target file(s) will be placed.

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'images',
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: (url, resourcePath, context) => {
            // `resourcePath` is original absolute path to asset
            // `context` is directory where stored asset (`rootContext`) or `context` option

            // To get relative path you can use
            // const relativePath = path.relative(context, resourcePath);

            if (/my-custom-image\.png/.test(resourcePath)) {
              return `other_output_path/${url}`;
            }

            if (/images/.test(context)) {
              return `image_output_path/${url}`;
            }

            return `output_path/${url}`;
          },
        },
      },
    ],
  },
};
```

### `publicPath`

Type: `String|Function`
Default: [`__webpack_public_path__`](https://webpack.js.org/api/module-variables/#__webpack_public_path__-webpack-specific-)

Specifies a custom public path for the target file(s).

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          publicPath: 'assets',
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          publicPath: (url, resourcePath, context) => {
            // `resourcePath` is original absolute path to asset
            // `context` is directory where stored asset (`rootContext`) or `context` option

            // To get relative path you can use
            // const relativePath = path.relative(context, resourcePath);

            if (/my-custom-image\.png/.test(resourcePath)) {
              return `other_public_path/${url}`;
            }

            if (/images/.test(context)) {
              return `image_output_path/${url}`;
            }

            return `public_path/${url}`;
          },
        },
      },
    ],
  },
};
```

### `context`

Type: `String`
Default: [`context`](https://webpack.js.org/configuration/entry-context/#context)

Specifies a custom file context.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          context: 'project',
        },
      },
    ],
  },
};
```

### `emitFile`

Type: `Boolean`
Default: `true`

If true, emits a file (writes a file to the filesystem). If false, the loader
will return a public URI but **will not** emit the file. It is often useful to
disable this option for server-side packages.

**file.js**

```js
// bundle file
import img from './file.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'file-loader',
        options: {
          emitFile: false,
        },
      },
    ],
  },
};
```

### `regExp`

Type: `RegExp`
Default: `undefined`

Specifies a Regular Expression to one or many parts of the target file path.
The capture groups can be reused in the `name` property using `[N]`
[placeholder](https://github.com/webpack-contrib/file-loader#placeholders).

**file.js**

```js
import img from './customer01/file.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/,
          name: '[1]-[name].[ext]',
        },
      },
    ],
  },
};
```

> ℹ️ If `[0]` is used, it will be replaced by the entire tested string, whereas `[1]` will contain the first capturing parenthesis of your regex and so on...

## Placeholders

Full information about placeholders you can find [here](https://github.com/webpack/loader-utils#interpolatename).

### `[ext]`

Type: `String`
Default: `file.extname`

The file extension of the target file/resource.

### `[name]`

Type: `String`
Default: `file.basename`

The basename of the file/resource.

### `[path]`

Type: `String`
Default: `file.directory`

The path of the resource relative to the webpack/config `context`.

### `[folder]`

Type: `String`
Default: `file.folder`

The folder of the resource is in.

### `[emoji]`

Type: `String`
Default: `undefined`

A random emoji representation of `content`.

### `[emoji:<length>]`

Type: `String`
Default: `undefined`

Same as above, but with a customizable number of emojis

### `[hash]`

Type: `String`
Default: `md5`

Specifies the hash method to use for hashing the file content.

### `[<hashType>:hash:<digestType>:<length>]`

Type: `String`

The hash of options.content (Buffer) (by default it's the hex digest of the hash).

#### `digestType`

Type: `String`
Default: `'hex'`

The [digest](https://en.wikipedia.org/wiki/Cryptographic_hash_function) that the
hash function should use. Valid values include: base26, base32, base36,
base49, base52, base58, base62, base64, and hex.

#### `hashType`

Type: `String`
Default: `'md5'`

The type of hash that the has function should use. Valid values include: `md5`,
`sha1`, `sha256`, and `sha512`.

#### `length`

Type: `Number`
Default: `undefined`

Users may also specify a length for the computed hash.

### `[N]`

Type: `String`
Default: `undefined`

The n-th match obtained from matching the current file name against the `regExp`.

## Examples

The following examples show how one might use `file-loader` and what the result would be.

**file.js**

```js
import png from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'dirname/[hash].[ext]',
        },
      },
    ],
  },
};
```

Result:

```bash
# result
dirname/0dcbbaa701328ae351f.png
```

---

**file.js**

```js
import png from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[sha512:hash:base64:7].[ext]',
        },
      },
    ],
  },
};
```

Result:

```bash
# result
gdyb21L.png
```

---

**file.js**

```js
import png from './path/to/file.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]?[hash]',
        },
      },
    ],
  },
};
```

Result:

```bash
# result
path/to/file.png?e43b20c069c4a01867c31e98cbce33c9
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/file-loader.svg
[npm-url]: https://npmjs.com/package/file-loader
[node]: https://img.shields.io/node/v/file-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/file-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/file-loader
[tests]: https://img.shields.io/circleci/project/github/webpack-contrib/file-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/file-loader
[cover]: https://codecov.io/gh/webpack-contrib/file-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/file-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=file-loader
[size-url]: https://packagephobia.now.sh/result?p=file-loader
