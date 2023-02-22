# stylus-loader
A [stylus](http://learnboost.github.io/stylus/) loader for [webpack](https://github.com/webpack/webpack).

[![build status](https://secure.travis-ci.org/shama/stylus-loader.svg)](https://travis-ci.org/shama/stylus-loader)
[![NPM version](https://badge.fury.io/js/stylus-loader.svg)](https://badge.fury.io/js/stylus-loader)

## Install

`npm install stylus-loader stylus --save-dev`

**Important**: in order to have ability use any `stylus` package version,
it won't be installed automatically. So it's required to
add it to `package.json` along with `stylus-loader`.

The latest version supporting webpack 1 can be installed with:

`npm install stylus-loader@webpack1 stylus --save-dev`

## Usage

```js
var css = require('!raw!stylus!./file.styl'); // Just the CSS
var css = require('!css!stylus!./file.styl'); // CSS with processed url(...)s
```

See [css-loader](https://github.com/webpack/css-loader) to see the effect of processed `url(...)`s.

Or within the webpack config:

```js
module: {
  loaders: [{
    test: /\.styl$/,
    loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
  }]
}
```

Then you can: `var css = require('./file.styl');`.

Use in tandem with the [style-loader](https://github.com/webpack/style-loader) to add the css rules to your `document`:

```js
module: {
  loaders: [
    { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
  ]
}
```

and then `require('./file.styl');` will compile and add the CSS to your page.

`stylus-loader` can also take advantage of webpack's resolve options. With the default options it'll find files in `web_modules` as well as `node_modules`, make sure to prefix any lookup in node_modules with `~`. For example if you have a styles package lookup files in it like `@import '~styles/my-styles`. It can also find stylus files without having the extension specified in the `@import` and index files in folders if webpack is configured for stylus's file extension.

```js
module: {
  resolve: {
    extensions: ['', '.js', '.styl']
  }
}
```

will let you have an `index.styl` file in your styles package and `require('styles')` or `@import '~styles'` it. It also lets you load a stylus file from a package installed in node_modules or if you add a modulesDirectories, like `modulesDirectories: ['node_modules', 'web_modules', 'bower_components']` option you could load from a folder like bower_components. To load files from a relative path leave off the `~` and `@import 'relative-styles/my-styles';` it.

Be careful though not to use the extensions configuration for two types of in one folder. If a folder has a `index.js` and a `index.styl` and you `@import './that-folder'`, it'll end up importing a javascript file into your stylus.

### Stylus Plugins

You can also use stylus plugins by adding an extra `stylus` section to your `webpack.config.js`.

```js
var stylus_plugin = require('stylus_plugin');
module: {
  loaders: [
    { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
  ]
},
stylus: {
  use: [stylus_plugin()]
}
```

Multiple configs can be used by giving other configs different names and referring to the with the `config` query option.


```js
var stylus_plugin = require('stylus_plugin');
module: {
  loaders: [
    {
      test: /\.other\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader?config=stylusOther'
    }
  ]
},
stylusOther: {
  use: [stylus_plugin()]
}
```

#### Webpack 2

Webpack 2 formalizes its options with a schema. Options can be provided to `stylus-loader` in the options field to `module.rules` or through LoaderOptionsPlugin or `stylus-loader`'s OptionsPlugin (a convenience wrapper around LoaderOptionsPlugin).

Config through module rules:

```js
module: {
  rules: [
    {
      test: /\.styl$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'stylus-loader',
          options: {
            use: [stylus_plugin()],
          },
        },
      ],
    }
  ],
},
```

Config through LoaderOptionsPlugin:

```js
module: {
  rules: [
    {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader',
    },
  ],
},
plugins: [
  new webpack.LoaderOptionsPlugin({
    test: /\.styl$/,
    stylus: {
      // You can have multiple stylus configs with other names and use them
      // with `stylus-loader?config=otherConfig`.
      default: {
        use: [stylus_plugin()],
      },
      otherConfig: {
        use: [other_plugin()],
      },
    },
  }),
],
```

Config through `stylus-loader`'s OptionsPlugin (convenience wrapper for LoaderOptionsPlugin):

```js
plugins: [
  new stylusLoader.OptionsPlugin({
    default: {
      use: [stylus_plugin()],
    },
  }),
],
```

#### Using nib with stylus

The easiest way of enabling `nib` is to import it in the stylus options:

```js
stylus: {
  use: [require('nib')()],
  import: ['~nib/lib/nib/index.styl']
}
```

where `~` resolves to `node_modules/`

### Prefer webpack resolving

`stylus-loader` currently prefers resolving paths with stylus's resovling utilities and then falling back to webpack when it can't find files. Use the `preferPathResolver` option with the value `'webpack'` to swap this. This has the benefit of using webpack's async resolving instead of stylus's sync resolving. If you have a lot of dependencies in your stylus files this'll let those dependencies be found in parallel.

```js
stylus: {
  preferPathResolver: 'webpack',
}
```

## Testing

```
npm test
open http://localhost:8080/test/
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.

## Release History
* Please see https://github.com/shama/stylus-loader/releases
* 3.0.1 - Update install instructions mentioning how to get a version supporting webpack 1 (@mzgoddard)
* 3.0.0 - Fix loader-utils deprecation warning (@ryani33), Drop webpack 1 and Node<4 support (@mzgoddard)
* 2.5.1 - Fix paths mutation in options (@vio)
* 2.5.0 - Define paths in global stylusOptions, in addtion to query params (@JounQin)
* 2.4.0 - Add OptionsPlugin to help support webpack 2 (@mzgoddard)
* 2.3.1 - Fix typo in README (@stevewillard)
* 2.3.0 - Fix most use cases of relative path resolving (@mzgoddard), Add option to prefer a path resolver (webpack or stylus) (@mzgoddard)
* 2.2.0 - Let stylus use option be just a function (@yuffiy), Track json calls as imports like use calls (@gnarf)
* 2.1.2 - Fix support for stylus include config (@andrewburgess), Add block-level imports to listimports (@kenaniah)
* 2.1.1 - Support Node 6 (@yyx990803), Test in webpack 1 and 2 (@phyllisstein)
* 2.1.0 - Add support for stylus's include and set (@michaek)
* 2.0.1 - Add peer dependency on stylus (@jchitel), fix PathCache for webpack 2 (@Unhelpful)
* 2.0.0 - Remove dependency on stylus (@kossnocorps)
* 1.6.1 - Remove version breaking change in 1.6.0
* 1.6.0 - Remove dependency on stylus (@kossnocorps)
* 1.3.0 - resolve use() calls (@mzgoddard), manual imports through path cache (@mzgoddard)
* 1.2.0 - files in package.json (@SimenB), test running with testem (@mzgoddard), and some performance changes (@mzgoddard)
* 1.1.0 - Pass through sourceMap option to stylus instead of defaulting to inline. Inherit source-map from devtool (@jordansexton).
* 1.0.0 - Basic source map support (@skozin). Remove nib as dep. stylus is now a direct dep (as peerDependencies are deprecated).
* 0.6.0 - Support loader prefixes when resolving paths (@kpdecker).
* 0.5.0 - Disable Stylus parser caching in listImports (@DaQuirm). Update to stylus@0.49.2 and nib@1.0.4 as peerDependencies (@kompot).
* 0.4.0 - Allow configuration of plugins through webpack config (@bobzoller). Update to stylus 0.47.2 (@shanewilson).
* 0.3.1 - Fix when dependency (@tkellen)
* 0.3.0 - Define url resolver() when "resolve url" option is true (@mzgoddard).
* 0.2.0 - Now tracks dependencies for @import statements making cacheable work. Update stylus dep.
* 0.1.0 - Initial release

## License
Copyright (c) 2018 Kyle Robinson Young  
Licensed under the MIT license.
