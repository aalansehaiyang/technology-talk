<div align="center">
  <img width="180" height="180" vspace="20"
    src="https://cdn.worldvectorlogo.com/logos/css-3.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# css-loader

The `css-loader` interprets `@import` and `url()` like `import/require()` and will resolve them.

## Getting Started

To begin, you'll need to install `css-loader`:

```console
npm install --save-dev css-loader
```

Then add the plugin to your `webpack` config. For example:

**file.js**

```js
import css from 'file.css';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

Good loaders for requiring your assets are the [file-loader](https://github.com/webpack/file-loader) and the [url-loader](https://github.com/webpack/url-loader) which you should specify in your config (see [below](https://github.com/webpack-contrib/css-loader#assets)).

And run `webpack` via your preferred method.

### `toString`

You can also use the css-loader results directly as a string, such as in Angular's component style.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
      },
    ],
  },
};
```

or

```js
const css = require('./test.css').toString();

console.log(css); // {String}
```

If there are SourceMaps, they will also be included in the result string.

If, for one reason or another, you need to extract CSS as a
plain string resource (i.e. not wrapped in a JS module) you
might want to check out the [extract-loader](https://github.com/peerigon/extract-loader).
It's useful when you, for instance, need to post process the CSS as a string.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'handlebars-loader', // handlebars loader expects raw resource string
          'extract-loader',
          'css-loader',
        ],
      },
    ],
  },
};
```

## Options

|                    Name                     |         Type          |     Default     | Description                                                              |
| :-----------------------------------------: | :-------------------: | :-------------: | :----------------------------------------------------------------------- |
|              **[`url`](#url)**              | `{Boolean\|Function}` |     `true`      | Enable/Disable `url()` handling                                          |
|           **[`import`](#import)**           | `{Boolean\/Function}` |     `true`      | Enable/Disable @import handling                                          |
|          **[`modules`](#modules)**          |  `{Boolean\|String}`  |     `false`     | Enable/Disable CSS Modules and setup mode                                |
|   **[`localIdentName`](#localidentname)**   |      `{String}`       | `[hash:base64]` | Configure the generated ident                                            |
|          **[`context`](#context)**          |      `{String}`       |   `undefined`   | Allow to redefine basic loader context for local ident name              |
|       **[`hashPrefix`](#hashprefix)**       |      `{String}`       |   `undefined`   | Allow to add custom hash to generate more unique classes                 |
|    **[`getLocalIdent`](#getlocalident)**    |     `{Function}`      |   `undefined`   | Configure the function to generate classname based on a different schema |
|        **[`sourceMap`](#sourcemap)**        |      `{Boolean}`      |     `false`     | Enable/Disable Sourcemaps                                                |
|        **[`camelCase`](#camelcase)**        |  `{Boolean\|String}`  |     `false`     | Export Classnames in CamelCase                                           |
|    **[`importLoaders`](#importloaders)**    |      `{Number}`       |       `0`       | Number of loaders applied before CSS loader                              |
| **[`exportOnlyLocals`](#exportonlylocals)** |      `{Boolean}`      |     `false`     | Export only locals                                                       |

### `url`

Type: `Boolean|Function`
Default: `true`

Control `url()` resolving. Absolute URLs and root-relative URLs are not resolving.

Examples resolutions:

```
url(image.png) => require('./image.png')
url('image.png') => require('./image.png')
url(./image.png) => require('./image.png')
url('./image.png') => require('./image.png')
url('http://dontwritehorriblecode.com/2112.png') => require('http://dontwritehorriblecode.com/2112.png')
image-set(url('image2x.png') 1x, url('image1x.png') 2x) => require('./image1x.png') and require('./image2x.png')
```

To import assets from a `node_modules` path (include `resolve.modules`) and for `alias`, prefix it with a `~`:

```
url(~module/image.png) => require('module/image.png')
url('~module/image.png') => require('module/image.png')
url(~aliasDirectory/image.png) => require('otherDirectory/image.png')
```

#### `Boolean`

Enable/disable `url()` resolving.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          url: true,
        },
      },
    ],
  },
};
```

#### `Function`

Allow to filter `url()`. All filtered `url()` will not be resolved (left in the code as they were written).

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          url: (url, resourcePath) => {
            // resourcePath - path to css file

            // `url()` with `img.png` stay untouched
            return url.includes('img.png');
          },
        },
      },
    ],
  },
};
```

### `import`

Type: `Boolean`
Default: `true`

Control `@import` resolving. Absolute urls in `@import` will be moved in runtime code.

Examples resolutions:

```
@import 'style.css' => require('./style.css')
@import url(style.css) => require('./style.css')
@import url('style.css') => require('./style.css')
@import './style.css' => require('./style.css')
@import url(./style.css) => require('./style.css')
@import url('./style.css') => require('./style.css')
@import url('http://dontwritehorriblecode.com/style.css') => @import url('http://dontwritehorriblecode.com/style.css') in runtime
```

To import styles from a `node_modules` path (include `resolve.modules`) and for `alias`, prefix it with a `~`:

```
@import url(~module/style.css) => require('module/style.css')
@import url('~module/style.css') => require('module/style.css')
@import url(~aliasDirectory/style.css) => require('otherDirectory/style.css')
```

#### `Boolean`

Enable/disable `@import` resolving.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          import: true,
        },
      },
    ],
  },
};
```

#### `Function`

Allow to filter `@import`. All filtered `@import` will not be resolved (left in the code as they were written).

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          import: (parsedImport, resourcePath) => {
            // parsedImport.url - url of `@import`
            // parsedImport.media - media query of `@import`
            // resourcePath - path to css file

            // `@import` with `style.css` stay untouched
            return parsedImport.url.includes('style.css');
          },
        },
      },
    ],
  },
};
```

### [`modules`](https://github.com/css-modules/css-modules)

Type: `Boolean|String`
Default: `false`

The `modules` option enables/disables the **CSS Modules** spec and setup basic behaviour.

|      Name      |    Type     | Description                                                                                                                      |
| :------------: | :---------: | :------------------------------------------------------------------------------------------------------------------------------- |
|   **`true`**   | `{Boolean}` | Enables local scoped CSS by default (use **local** mode by default)                                                              |
|  **`false`**   | `{Boolean}` | Disable the **CSS Modules** spec, all **CSS Modules** features (like `@value`, `:local`, `:global` and `composes`) will not work |
| **`'local'`**  | `{String}`  | Enables local scoped CSS by default (same as `true` value)                                                                       |
| **`'global'`** | `{String}`  | Enables global scoped CSS by default                                                                                             |

Using `false` value increase performance because we avoid parsing **CSS Modules** features, it will be useful for developers who use vanilla css or use other technologies.

You can read about **modes** below.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: true,
        },
      },
    ],
  },
};
```

##### `Scope`

Using `local` value requires you to specify `:global` classes.
Using `global` value requires you to specify `:local` classes.

You can find more information [here](https://github.com/css-modules/css-modules).

Styles can be locally scoped to avoid globally scoping styles.

The syntax `:local(.className)` can be used to declare `className` in the local scope. The local identifiers are exported by the module.

With `:local` (without brackets) local mode can be switched on for this selector.
The `:global(.className)` nocation can be used to declare an explicit global selector.
With `:global` (without brackets) global mode can be switched on for this selector.

The loader replaces local selectors with unique identifiers. The chosen unique identifiers are exported by the module.

```css
:local(.className) {
  background: red;
}
:local .className {
  color: green;
}
:local(.className .subClass) {
  color: green;
}
:local .className .subClass :global(.global-class-name) {
  color: blue;
}
```

```css
._23_aKvs-b8bW2Vg3fwHozO {
  background: red;
}
._23_aKvs-b8bW2Vg3fwHozO {
  color: green;
}
._23_aKvs-b8bW2Vg3fwHozO ._13LGdX8RMStbBE9w-t0gZ1 {
  color: green;
}
._23_aKvs-b8bW2Vg3fwHozO ._13LGdX8RMStbBE9w-t0gZ1 .global-class-name {
  color: blue;
}
```

> ℹ️ Identifiers are exported

```js
exports.locals = {
  className: '_23_aKvs-b8bW2Vg3fwHozO',
  subClass: '_13LGdX8RMStbBE9w-t0gZ1',
};
```

CamelCase is recommended for local selectors. They are easier to use within the imported JS module.

You can use `:local(#someId)`, but this is not recommended. Use classes instead of ids.

##### `Composing`

When declaring a local classname you can compose a local class from another local classname.

```css
:local(.className) {
  background: red;
  color: yellow;
}

:local(.subClass) {
  composes: className;
  background: blue;
}
```

This doesn't result in any change to the CSS itself but exports multiple classnames.

```js
exports.locals = {
  className: '_23_aKvs-b8bW2Vg3fwHozO',
  subClass: '_13LGdX8RMStbBE9w-t0gZ1 _23_aKvs-b8bW2Vg3fwHozO',
};
```

```css
._23_aKvs-b8bW2Vg3fwHozO {
  background: red;
  color: yellow;
}

._13LGdX8RMStbBE9w-t0gZ1 {
  background: blue;
}
```

##### `Importing`

To import a local classname from another module.

```css
:local(.continueButton) {
  composes: button from 'library/button.css';
  background: red;
}
```

```css
:local(.nameEdit) {
  composes: edit highlight from './edit.css';
  background: red;
}
```

To import from multiple modules use multiple `composes:` rules.

```css
:local(.className) {
  composes: edit hightlight from './edit.css';
  composes: button from 'module/button.css';
  composes: classFromThisModule;
  background: red;
}
```

### `localIdentName`

Type: `String`
Default: `[hash:base64]`

You can configure the generated ident with the `localIdentName` query parameter.
See [loader-utils's documentation](https://github.com/webpack/loader-utils#interpolatename) for more information on options.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[path][name]__[local]--[hash:base64:5]',
        },
      },
    ],
  },
};
```

### `context`

Type: `String`
Default: `undefined`

Allow to redefine basic loader context for local ident name.
By default we use `rootContext` of loader.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: true,
          context: path.resolve(__dirname, 'context'),
        },
      },
    ],
  },
};
```

### `hashPrefix`

Type: `String`
Default: `undefined`

Allow to add custom hash to generate more unique classes.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: true,
          hashPrefix: 'hash',
        },
      },
    ],
  },
};
```

### `getLocalIdent`

Type: `Function`
Default: `undefined`

You can also specify the absolute path to your custom `getLocalIdent` function to generate classname based on a different schema.
By default we use built-in function to generate a classname.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: true,
          getLocalIdent: (context, localIdentName, localName, options) => {
            return 'whatever_random_class_name';
          },
        },
      },
    ],
  },
};
```

### `sourceMap`

Type: `Boolean`
Default: `false`

To include source maps set the `sourceMap` option.

I.e. the `mini-css-extract-plugin` can handle them.

They are not enabled by default because they expose a runtime overhead and increase in bundle size (JS source maps do not). In addition to that relative paths are buggy and you need to use an absolute public path which includes the server URL.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },
};
```

### `camelCase`

Type: `Boolean|String`
Default: `false`

By default, the exported JSON keys mirror the class names. If you want to camelize class names (useful in JS), pass the query parameter `camelCase` to css-loader.

|        Name        |    Type     | Description                                                                                                              |
| :----------------: | :---------: | :----------------------------------------------------------------------------------------------------------------------- |
|    **`false`**     | `{Boolean}` | Class names will be camelized, the original class name will not to be removed from the locals                            |
|     **`true`**     | `{Boolean}` | Class names will be camelized                                                                                            |
|   **`'dashes'`**   | `{String}`  | Only dashes in class names will be camelized                                                                             |
|    **`'only'`**    | `{String}`  | Introduced in `0.27.1`. Class names will be camelized, the original class name will be removed from the locals           |
| **`'dashesOnly'`** | `{String}`  | Introduced in `0.27.1`. Dashes in class names will be camelized, the original class name will be removed from the locals |

**file.css**

```css
.class-name {
}
```

**file.js**

```js
import { className } from 'file.css';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          camelCase: true,
        },
      },
    ],
  },
};
```

### `importLoaders`

Type: `Number`
Default: `0`

The option `importLoaders` allows you to configure how many loaders before `css-loader` should be applied to `@import`ed resources.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
```

This may change in the future when the module system (i. e. webpack) supports loader matching by origin.

### `exportOnlyLocals`

Type: `Boolean`
Default: `false`

Export only locals (**useful** when you use **css modules**).
For pre-rendering with `mini-css-extract-plugin` you should use this option instead of `style-loader!css-loader` **in the pre-rendering bundle**.
It doesn't embed CSS but only exports the identifier mappings.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          exportOnlyLocals: true,
        },
      },
    ],
  },
};
```

## Examples

### Assets

The following `webpack.config.js` can load CSS files, embed small PNG/JPG/GIF/SVG images as well as fonts as [Data URLs](https://tools.ietf.org/html/rfc2397) and copy larger files to the output directory.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
};
```

### Extract

For production builds it's recommended to extract the CSS from your bundle being able to use parallel loading of CSS/JS resources later on.

- This can be achieved by using the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to extract the CSS when running in production mode.

- As an alternative, if seeking better development performance and css outputs that mimic production. [extract-css-chunks-webpack-plugin](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin) offers a hot module reload friendly, extended version of mini-css-extract-plugin. HMR real CSS files in dev, works like mini-css in non-dev

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/css-loader.svg
[npm-url]: https://npmjs.com/package/css-loader
[node]: https://img.shields.io/node/v/css-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/css-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/css-loader
[tests]: https://img.shields.io/circleci/project/github/webpack-contrib/css-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/css-loader
[cover]: https://codecov.io/gh/webpack-contrib/css-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/css-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=css-loader
[size-url]: https://packagephobia.now.sh/result?p=css-loader
