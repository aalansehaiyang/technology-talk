# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.1](https://github.com/webpack-contrib/cache-loader/compare/v3.0.0...v3.0.1) (2019-05-13)


### Bug Fixes

* watch on windows ([#74](https://github.com/webpack-contrib/cache-loader/issues/74)) ([4bc6732](https://github.com/webpack-contrib/cache-loader/commit/4bc6732))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/webpack-contrib/cache-loader/compare/v2.0.1...v3.0.0) (2019-04-19)


### Bug Fixes

* usage with raw loaders ([#69](https://github.com/webpack-contrib/cache-loader/issues/69)) ([4924341](https://github.com/webpack-contrib/cache-loader/commit/4924341))


### Features

* change default cache directory ([#64](https://github.com/webpack-contrib/cache-loader/issues/64)) ([fd1c6d7](https://github.com/webpack-contrib/cache-loader/commit/fd1c6d7))


### BREAKING CHANGES

* default cache directory is `node_modules/.cache/cache-loader`



<a name="2.0.1"></a>
## [2.0.1](https://github.com/webpack-contrib/cache-loader/compare/v2.0.0...v2.0.1) (2019-01-04)


### Bug Fixes

* generate normalized cache context relative paths ([#54](https://github.com/webpack-contrib/cache-loader/issues/54)) ([5b37474](https://github.com/webpack-contrib/cache-loader/commit/5b37474))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/webpack-contrib/cache-loader/compare/v1.2.5...v2.0.0) (2018-12-21)


### Chores

* drop support for `webpack` < 4 ([#51](https://github.com/webpack-contrib/cache-loader/issues/51)) ([2e76d3f](https://github.com/webpack-contrib/cache-loader/commit/2e76d3f))
* drop support for node < 6 ([#50](https://github.com/webpack-contrib/cache-loader/issues/50)) ([b8225cd](https://github.com/webpack-contrib/cache-loader/commit/b8225cd))


### Features

* add `cacheContext` option ([#49](https://github.com/webpack-contrib/cache-loader/issues/49)) ([22d0173](https://github.com/webpack-contrib/cache-loader/commit/22d0173))


### BREAKING CHANGES

* drop support for `webpack` < 4
* drop support for node < 6



<a name="1.2.5"></a>
## [1.2.5](https://github.com/webpack-contrib/cache-loader/compare/v1.2.4...v1.2.5) (2018-10-31)


### Bug Fixes

* **index:** `this` of `stat` method is `undefined` ([#47](https://github.com/webpack-contrib/cache-loader/issues/47)) ([5c67ccd](https://github.com/webpack-contrib/cache-loader/commit/5c67ccd))



<a name="1.2.4"></a>
## [1.2.4](https://github.com/webpack-contrib/cache-loader/compare/v1.2.3...v1.2.4) (2018-10-31)


### Bug Fixes

* **index:** fallback to `fs` if `this.fs` is `undefined` ([#45](https://github.com/webpack-contrib/cache-loader/issues/45)) ([b84d13e](https://github.com/webpack-contrib/cache-loader/commit/b84d13e))



<a name="1.2.3"></a>
## [1.2.3](https://github.com/webpack-contrib/cache-loader/compare/v1.2.2...v1.2.3) (2018-10-30)


### Performance Improvements

* **index:** use the `compiler`'s cached `fs` for stats (`this.fs.stat`) ([#42](https://github.com/webpack-contrib/cache-loader/issues/42)) ([d8c630b](https://github.com/webpack-contrib/cache-loader/commit/d8c630b))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/webpack-contrib/cache-loader/compare/v1.2.1...v1.2.2) (2018-02-27)


### Performance Improvements

* use `neo-async` instead `async` ([#31](https://github.com/webpack-contrib/cache-loader/issues/31)) ([0851582](https://github.com/webpack-contrib/cache-loader/commit/0851582))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/webpack-contrib/cache-loader/compare/v1.2.0...v1.2.1) (2018-02-26)


### Bug Fixes

* **package:** add `webpack >= v4.0.0` (`peerDependencies`) ([#32](https://github.com/webpack-contrib/cache-loader/issues/32)) ([a5e921c](https://github.com/webpack-contrib/cache-loader/commit/a5e921c))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/webpack-contrib/cache-loader/compare/v1.1.0...v1.2.0) (2017-11-17)


### Bug Fixes

* **index:** check for inaccurate filesystem (`mtime`)  ([f24f723](https://github.com/webpack-contrib/cache-loader/commit/f24f723))


### Features

* add `options` validation (`schema-utils`) ([#24](https://github.com/webpack-contrib/cache-loader/issues/24)) ([4ac7807](https://github.com/webpack-contrib/cache-loader/commit/4ac7807))
* add support for custom cache stores (`options.read/options.write`) ([#19](https://github.com/webpack-contrib/cache-loader/issues/19)) ([060796b](https://github.com/webpack-contrib/cache-loader/commit/060796b))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/webpack-contrib/cache-loader/compare/v1.0.3...v1.1.0) (2017-10-09)


### Bug Fixes

* add `cacheIdentifier` to documentation ([9a18ba9](https://github.com/webpack-contrib/cache-loader/commit/9a18ba9))
* upgrade webpack-defaults, add missing dependency ([5025869](https://github.com/webpack-contrib/cache-loader/commit/5025869))


### Features

* invalidate cache ([#9](https://github.com/webpack-contrib/cache-loader/issues/9)) ([663e18a](https://github.com/webpack-contrib/cache-loader/commit/663e18a))


### Performance Improvements

* throw early if file doesn't exists ([#5](https://github.com/webpack-contrib/cache-loader/issues/5)) ([a7f3449](https://github.com/webpack-contrib/cache-loader/commit/a7f3449))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/webpack-contrib/cache-loader/compare/v1.0.2...v1.0.3) (2017-04-26)


### Bug Fixes

* **readme:** remove typo and add additional note ([cc63a7f](https://github.com/webpack-contrib/cache-loader/commit/cc63a7f))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/webpack-contrib/cache-loader/compare/v1.0.1...v1.0.2) (2017-04-26)


### Bug Fixes

* **readme:** fill content into the README ([7b5d5fd](https://github.com/webpack-contrib/cache-loader/commit/7b5d5fd))



<a name="1.0.1"></a>
## 1.0.1 (2017-04-26)



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

x.x.x / <year>-<month>-<day>
==================

  * Bug fix -
  * Feature -
  * Chore -
  * Docs -
