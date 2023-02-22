# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.1.1"></a>
## [2.1.1](https://github.com/webpack-contrib/css-loader/compare/v2.1.0...v2.1.1) (2019-03-07)


### Bug Fixes

* do not break selector with escaping ([#896](https://github.com/webpack-contrib/css-loader/issues/896)) ([0ba8c66](https://github.com/webpack-contrib/css-loader/commit/0ba8c66))
* source map generation when `sourceRoot` is present ([#901](https://github.com/webpack-contrib/css-loader/issues/901)) ([e9ce745](https://github.com/webpack-contrib/css-loader/commit/e9ce745))
* sourcemap generating when previous loader pass sourcemap as string ([#905](https://github.com/webpack-contrib/css-loader/issues/905)) ([3797e4d](https://github.com/webpack-contrib/css-loader/commit/3797e4d))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/webpack-contrib/css-loader/compare/v2.0.2...v2.1.0) (2018-12-25)


### Features

* support `image-set` without `url` ([#879](https://github.com/webpack-contrib/css-loader/issues/879)) ([21884e2](https://github.com/webpack-contrib/css-loader/commit/21884e2))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/webpack-contrib/css-loader/compare/v2.0.1...v2.0.2) (2018-12-21)


### Bug Fixes

* inappropriate modification of animation keywords ([#876](https://github.com/webpack-contrib/css-loader/issues/876)) ([dfb2f8e](https://github.com/webpack-contrib/css-loader/commit/dfb2f8e))



<a name="2.0.1"></a>
# [2.0.1](https://github.com/webpack-contrib/css-loader/compare/v2.0.0...v2.0.1) (2018-12-14)


### Bug Fixes

* safe checking if params are present for at rule ([#871](https://github.com/webpack-contrib/css-loader/issues/871)) ([a88fed1](https://github.com/webpack-contrib/css-loader/commit/a88fed1))
* `getLocalIdent` now accepts `false` value ([#865](https://github.com/webpack-contrib/css-loader/issues/865)) ([1825e8a](https://github.com/webpack-contrib/css-loader/commit/1825e8a))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/webpack-contrib/css-loader/compare/v1.0.1...v2.0.0) (2018-12-07)


### Bug Fixes

* broken unucode characters ([#850](https://github.com/webpack-contrib/css-loader/issues/850)) ([f599c70](https://github.com/webpack-contrib/css-loader/commit/f599c70))
* correctly processing `urls()` with `?#hash` ([#803](https://github.com/webpack-contrib/css-loader/issues/803)) ([417d105](https://github.com/webpack-contrib/css-loader/commit/417d105))
* don't break loader on invalid or not exists url or import token ([#827](https://github.com/webpack-contrib/css-loader/issues/827)) ([9e52d26](https://github.com/webpack-contrib/css-loader/commit/9e52d26))
* don't duplicate import with same media in different case ([#819](https://github.com/webpack-contrib/css-loader/issues/819)) ([9f66e33](https://github.com/webpack-contrib/css-loader/commit/9f66e33))
* emit warnings on broken `import` at-rules ([#806](https://github.com/webpack-contrib/css-loader/issues/806)) ([4bdf08b](https://github.com/webpack-contrib/css-loader/commit/4bdf08b))
* handle uppercase `URL` in `import` at-rules ([#818](https://github.com/webpack-contrib/css-loader/issues/818)) ([3ebdcd5](https://github.com/webpack-contrib/css-loader/commit/3ebdcd5))
* inconsistent generate class names for css modules on difference os ([#812](https://github.com/webpack-contrib/css-loader/issues/812)) ([0bdf9b7](https://github.com/webpack-contrib/css-loader/commit/0bdf9b7))
* reduce number of `require` for `urls()` ([#854](https://github.com/webpack-contrib/css-loader/issues/854)) ([3338656](https://github.com/webpack-contrib/css-loader/commit/3338656))
* support deduplication of string module ids (optimization.namedModules) ([#789](https://github.com/webpack-contrib/css-loader/issues/789)) ([e3bb83a](https://github.com/webpack-contrib/css-loader/commit/e3bb83a))
* support module resolution in `composes` ([#845](https://github.com/webpack-contrib/css-loader/issues/845)) ([453248f](https://github.com/webpack-contrib/css-loader/commit/453248f))
* same `urls()` resolving logic for `modules` (`local` and `global`) and without modules ([#843](https://github.com/webpack-contrib/css-loader/issues/843)) ([fdcf687](https://github.com/webpack-contrib/css-loader/commit/fdcf687))

### Features

* allow to disable css modules and **disable their by default** ([#842](https://github.com/webpack-contrib/css-loader/issues/842)) ([889dc7f](https://github.com/webpack-contrib/css-loader/commit/889dc7f))
* disable `import` option doesn't affect on `composes` ([#822](https://github.com/webpack-contrib/css-loader/issues/822)) ([f9aa73c](https://github.com/webpack-contrib/css-loader/commit/f9aa73c))
* allow to filter `urls` ([#856](https://github.com/webpack-contrib/css-loader/issues/856)) ([5e702e7](https://github.com/webpack-contrib/css-loader/commit/5e702e7))
* allow to filter `import` at-rules ([#857](https://github.com/webpack-contrib/css-loader/issues/857)) ([5e6034c](https://github.com/webpack-contrib/css-loader/commit/5e6034c))
* emit warning on invalid `urls()` ([#832](https://github.com/webpack-contrib/css-loader/issues/832)) ([da95db8](https://github.com/webpack-contrib/css-loader/commit/da95db8))
* added `exportOnlyLocals` option ([#824](https://github.com/webpack-contrib/css-loader/issues/824)) ([e9327c0](https://github.com/webpack-contrib/css-loader/commit/e9327c0))
* reuse `postcss` ast from other loaders (i.e `postcss-loader`) ([#840](https://github.com/webpack-contrib/css-loader/issues/840)) ([1dad1fb](https://github.com/webpack-contrib/css-loader/commit/1dad1fb))
* schema options ([b97d997](https://github.com/webpack-contrib/css-loader/commit/b97d997))


### BREAKING CHANGES

* resolving logic for `url()` and `import` at-rules works the same everywhere, it does not matter whether css modules are enabled (with `global` and `local` module) or not. Examples - `url('image.png')` as `require('./image.png')`, `url('./image.png')` as `require('./image.png')`, `url('~module/image.png')` as `require('module/image.png')`.
* by default css modules are disabled (now `modules: false` disable all css modules features), you can return old behaviour change this on `modules: 'global'`
* `css-loader/locals` was dropped in favor `exportOnlyLocals` option
* `import` option only affect on `import` at-rules and doesn't affect on `composes` declarations
* invalid `@import` at rules now emit warnings
* use `postcss@7`



<a name="1.0.1"></a>
## [1.0.1](https://github.com/webpack-contrib/css-loader/compare/v1.0.0...v1.0.1) (2018-10-29)


### Bug Fixes

* **loader:** trim unquoted import urls ([#783](https://github.com/webpack-contrib/css-loader/issues/783)) ([21fcddf](https://github.com/webpack-contrib/css-loader/commit/21fcddf))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/webpack-contrib/css-loader/compare/v0.28.11...v1.0.0) (2018-07-06)


### BREAKING CHANGES

* remove `minimize` option, use [`postcss-loader`](https://github.com/postcss/postcss-loader) with [`cssnano`](https://github.com/cssnano/cssnano) or use [`optimize-cssnano-plugin`](https://github.com/intervolga/optimize-cssnano-plugin) plugin
* remove `module` option, use `modules` option instead
* remove `camelcase` option, use `camelCase` option instead
* remove `root` option, use [`postcss-loader`](https://github.com/postcss/postcss-loader) with [`postcss-url`](https://github.com/postcss/postcss-url) plugin
* remove `alias` option, use [`resolve.alias`](https://webpack.js.org/configuration/resolve/) feature or use [`postcss-loader`](https://github.com/postcss/postcss-loader) with [`postcss-url`](https://github.com/postcss/postcss-url) plugin
* update `postcss` to `6` version
* minimum require `nodejs` version is `6.9`
* minimum require `webpack` version is `4`



<a name="0.28.11"></a>
## [0.28.11](https://github.com/webpack-contrib/css-loader/compare/v0.28.10...v0.28.11) (2018-03-16)


### Bug Fixes

* **lib/processCss:** don't check `mode` for `url` handling (`options.modules`) ([#698](https://github.com/webpack-contrib/css-loader/issues/698)) ([c788450](https://github.com/webpack-contrib/css-loader/commit/c788450))



<a name="0.28.10"></a>
## [0.28.10](https://github.com/webpack-contrib/css-loader/compare/v0.28.9...v0.28.10) (2018-02-22)


### Bug Fixes

* **getLocalIdent:** add `rootContext` support (`webpack >= v4.0.0`) ([#681](https://github.com/webpack-contrib/css-loader/issues/681)) ([9f876d2](https://github.com/webpack-contrib/css-loader/commit/9f876d2))



<a name="0.28.9"></a>
## [0.28.9](https://github.com/webpack-contrib/css-loader/compare/v0.28.8...v0.28.9) (2018-01-17)


### Bug Fixes

* ignore invalid URLs (`url()`) ([#663](https://github.com/webpack-contrib/css-loader/issues/663)) ([d1d8221](https://github.com/webpack-contrib/css-loader/commit/d1d8221))



<a name="0.28.8"></a>
## [0.28.8](https://github.com/webpack-contrib/css-loader/compare/v0.28.7...v0.28.8) (2018-01-05)


### Bug Fixes

* **loader:** correctly check if source map is `undefined` ([#641](https://github.com/webpack-contrib/css-loader/issues/641)) ([0dccfa9](https://github.com/webpack-contrib/css-loader/commit/0dccfa9))
* proper URL escaping and wrapping (`url()`) ([#627](https://github.com/webpack-contrib/css-loader/issues/627)) ([8897d44](https://github.com/webpack-contrib/css-loader/commit/8897d44))



<a name="0.28.7"></a>
## [0.28.7](https://github.com/webpack/css-loader/compare/v0.28.6...v0.28.7) (2017-08-30)


### Bug Fixes

* pass resolver to `localsLoader` (`options.alias`)  ([#601](https://github.com/webpack/css-loader/issues/601)) ([8f1b57c](https://github.com/webpack/css-loader/commit/8f1b57c))



<a name="0.28.6"></a>
## [0.28.6](https://github.com/webpack/css-loader/compare/v0.28.5...v0.28.6) (2017-08-30)


### Bug Fixes

* add support for aliases starting with `/` (`options.alias`) ([#597](https://github.com/webpack/css-loader/issues/597)) ([63567f2](https://github.com/webpack/css-loader/commit/63567f2))



<a name="0.28.5"></a>
## [0.28.5](https://github.com/webpack/css-loader/compare/v0.28.4...v0.28.5) (2017-08-17)


### Bug Fixes

* match mutliple dashes (`options.camelCase`) ([#556](https://github.com/webpack/css-loader/issues/556)) ([1fee601](https://github.com/webpack/css-loader/commit/1fee601))
* stricter `[@import](https://github.com/import)` tolerance ([#593](https://github.com/webpack/css-loader/issues/593)) ([2e4ec09](https://github.com/webpack/css-loader/commit/2e4ec09))



<a name="0.28.4"></a>
## [0.28.4](https://github.com/webpack/css-loader/compare/v0.28.3...v0.28.4) (2017-05-30)


### Bug Fixes

* preserve leading underscore in class names ([#543](https://github.com/webpack/css-loader/issues/543)) ([f6673c8](https://github.com/webpack/css-loader/commit/f6673c8))



<a name="0.28.3"></a>
## [0.28.3](https://github.com/webpack/css-loader/compare/v0.28.2...v0.28.3) (2017-05-25)


### Bug Fixes

* correct plugin order for CSS Modules ([#534](https://github.com/webpack/css-loader/issues/534)) ([b90f492](https://github.com/webpack/css-loader/commit/b90f492))



<a name="0.28.2"></a>
## [0.28.2](https://github.com/webpack/css-loader/compare/v0.28.1...v0.28.2) (2017-05-22)


### Bug Fixes

* source maps path on `windows` ([#532](https://github.com/webpack/css-loader/issues/532)) ([c3d0d91](https://github.com/webpack/css-loader/commit/c3d0d91))



<a name="0.28.1"></a>
## [0.28.1](https://github.com/webpack/css-loader/compare/v0.28.0...v0.28.1) (2017-05-02)


### Bug Fixes

* allow to specify a full hostname as a root URL ([#521](https://github.com/webpack/css-loader/issues/521)) ([06d27a1](https://github.com/webpack/css-loader/commit/06d27a1))
* case insensitivity of [@import](https://github.com/import) ([#514](https://github.com/webpack/css-loader/issues/514)) ([de4356b](https://github.com/webpack/css-loader/commit/de4356b))
* don't handle empty [@import](https://github.com/import) and url() ([#513](https://github.com/webpack/css-loader/issues/513)) ([868fc94](https://github.com/webpack/css-loader/commit/868fc94))
* imported variables are replaced in exports if followed by a comma ([#504](https://github.com/webpack/css-loader/issues/504)) ([956bad7](https://github.com/webpack/css-loader/commit/956bad7))
* loader now correctly handles `url` with space(s) ([#495](https://github.com/webpack/css-loader/issues/495)) ([534ea55](https://github.com/webpack/css-loader/commit/534ea55))
* url with a trailing space is now handled correctly ([#494](https://github.com/webpack/css-loader/issues/494)) ([e1ec4f2](https://github.com/webpack/css-loader/commit/e1ec4f2))
* use `btoa` instead `Buffer` ([#501](https://github.com/webpack/css-loader/issues/501)) ([fbb0714](https://github.com/webpack/css-loader/commit/fbb0714))


### Performance Improvements

* generate source maps only when explicitly set ([#478](https://github.com/webpack/css-loader/issues/478)) ([b8f5c8f](https://github.com/webpack/css-loader/commit/b8f5c8f))



<a name="0.28.0"></a>
# [0.28.0](https://github.com/webpack/css-loader/compare/v0.27.3...v0.28.0) (2017-03-30)


### Features

* add alias feature to rewrite URLs ([#274](https://github.com/webpack/css-loader/issues/274)) ([c8db489](https://github.com/webpack/css-loader/commit/c8db489))



<a name="0.27.3"></a>
## [0.27.3](https://github.com/webpack/css-loader/compare/v0.27.2...v0.27.3) (2017-03-13)



<a name="0.27.2"></a>
# [0.27.2](https://github.com/webpack/css-loader/compare/v0.27.1...v0.27.2) (2017-03-12)

<a name="0.27.1"></a>
# [0.27.1](https://github.com/webpack/css-loader/compare/v0.27.0...v0.27.1) (2017-03-10)

<a name="0.27.0"></a>
# [0.27.0](https://github.com/webpack/css-loader/compare/v0.26.2...v0.27.0) (2017-03-10)


### Bug Fixes

* **sourcemaps:** use abs paths & remove sourceRoot ([c769ac3](https://github.com/webpack/css-loader/commit/c769ac3))
* `minimizeOptions` should be `query.minimize`! ([16c0858](https://github.com/webpack/css-loader/commit/16c0858))
* do not export duplicate keys ([#420](https://github.com/webpack/css-loader/issues/420)) ([a2b85d7](https://github.com/webpack/css-loader/commit/a2b85d7))


### Features

* allow removal of original class name ([#445](https://github.com/webpack/css-loader/issues/445)) ([3f78361](https://github.com/webpack/css-loader/commit/3f78361))
* Include the sourceMappingURL & sourceURL when toString() ([6da7e90](https://github.com/webpack/css-loader/commit/6da7e90))
