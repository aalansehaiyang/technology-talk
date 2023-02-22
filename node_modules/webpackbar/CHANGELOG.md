# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.2.0"></a>
# [3.2.0](https://github.com/nuxt/webpackbar/compare/v3.1.5...v3.2.0) (2019-04-18)


### Bug Fixes

* path can be something else than a string ([#45](https://github.com/nuxt/webpackbar/issues/45)) ([b2ae0c9](https://github.com/nuxt/webpackbar/commit/b2ae0c9))
* **pkg:** remove nsp ([73ef3ae](https://github.com/nuxt/webpackbar/commit/73ef3ae))


### Features

* update dependencies ([9fc93e9](https://github.com/nuxt/webpackbar/commit/9fc93e9))



<a name="3.1.5"></a>
## [3.1.5](https://github.com/nuxt/webpackbar/compare/v3.1.4...v3.1.5) (2019-01-12)


### Bug Fixes

* **fancy:** eliminate the probability of replacement of stream.write conflicts ([#39](https://github.com/nuxt/webpackbar/issues/39)) ([b3b9c62](https://github.com/nuxt/webpackbar/commit/b3b9c62))



<a name="3.1.4"></a>
## [3.1.4](https://github.com/nuxt/webpackbar/compare/v3.1.3...v3.1.4) (2018-12-11)


### Bug Fixes

* avoid object.values for node < 7 compability ([83fcd06](https://github.com/nuxt/webpackbar/commit/83fcd06))



<a name="3.1.3"></a>
## [3.1.3](https://github.com/nuxt/webpackbar/compare/v3.1.2...v3.1.3) (2018-11-14)



<a name="3.1.2"></a>
## [3.1.2](https://github.com/nuxt/webpackbar/compare/v3.1.1...v3.1.2) (2018-11-09)


### Bug Fixes

* **profile:** use context.state ([0d92aae](https://github.com/nuxt/webpackbar/commit/0d92aae))
* revert back afterPlugins to call _ensureState ([2f17454](https://github.com/nuxt/webpackbar/commit/2f17454))
* update profile reporter ([4f28403](https://github.com/nuxt/webpackbar/commit/4f28403))
* **stats:** fix typo ([d2f6edb](https://github.com/nuxt/webpackbar/commit/d2f6edb))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/nuxt/webpackbar/compare/v3.1.0...v3.1.1) (2018-11-09)


### Bug Fixes

* prevent calling done hook twice ([1753826](https://github.com/nuxt/webpackbar/commit/1753826))
* **plugin:** handle conditions that start is not available ([4e0dc73](https://github.com/nuxt/webpackbar/commit/4e0dc73))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/nuxt/webpackbar/compare/v3.0.5...v3.1.0) (2018-11-09)


### Features

* prevent adding multi instances to the same compiler ([759a4e6](https://github.com/nuxt/webpackbar/commit/759a4e6))
* **log-update:** support concurrent writes to stdout/stderr on render ([d51c508](https://github.com/nuxt/webpackbar/commit/d51c508))



<a name="3.0.5"></a>
## [3.0.5](https://github.com/nuxt/webpackbar/compare/v3.0.4...v3.0.5) (2018-11-09)


### Bug Fixes

* detect and support old consola instance ([9fc6e09](https://github.com/nuxt/webpackbar/commit/9fc6e09))



<a name="3.0.4"></a>
## [3.0.4](https://github.com/nuxt/webpackbar/compare/v3.0.3...v3.0.4) (2018-11-09)


### Bug Fixes

* ensure state exists on hooks ([#30](https://github.com/nuxt/webpackbar/issues/30)) ([8f0085a](https://github.com/nuxt/webpackbar/commit/8f0085a))



<a name="3.0.3"></a>
## [3.0.3](https://github.com/nuxt/webpackbar/compare/v3.0.2...v3.0.3) (2018-11-08)



<a name="3.0.2"></a>
## [3.0.2](https://github.com/nuxt/webpackbar/compare/v3.0.1...v3.0.2) (2018-11-08)


### Bug Fixes

* **fancy:** resume consola befor we die! ([ea1c6a8](https://github.com/nuxt/webpackbar/commit/ea1c6a8))
* **stats:** report errors before we die ([53aa6bb](https://github.com/nuxt/webpackbar/commit/53aa6bb))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/nuxt/webpackbar/compare/v3.0.0...v3.0.1) (2018-11-08)


### Bug Fixes

* windows and linux don't support fsync ([8be7459](https://github.com/nuxt/webpackbar/commit/8be7459))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/nuxt/webpackbar/compare/v3.0.0-3...v3.0.0) (2018-11-07)



<a name="3.0.0-3"></a>
# [3.0.0-3](https://github.com/nuxt/webpackbar/compare/v3.0.0-2...v3.0.0-3) (2018-11-07)


### Bug Fixes

* unused plugin instances store state in global ([556f830](https://github.com/nuxt/webpackbar/commit/556f830))


### Features

* add change hook support ([8057e4c](https://github.com/nuxt/webpackbar/commit/8057e4c))



<a name="3.0.0-2"></a>
# [3.0.0-2](https://github.com/nuxt/webpackbar/compare/v3.0.0-1...v3.0.0-2) (2018-11-04)


### Bug Fixes

* convert name using startCase ([4264503](https://github.com/nuxt/webpackbar/commit/4264503))
* fix globalState bug ([8c0441b](https://github.com/nuxt/webpackbar/commit/8c0441b))
* handler assignment should be happened after super() call ([150699d](https://github.com/nuxt/webpackbar/commit/150699d))
* minor fixes ([d7a10c9](https://github.com/nuxt/webpackbar/commit/d7a10c9))
* refactor and memory improvements ([74d265a](https://github.com/nuxt/webpackbar/commit/74d265a))
* stability and improvements ([7e3e9ad](https://github.com/nuxt/webpackbar/commit/7e3e9ad))
* typo ([5dcd6bf](https://github.com/nuxt/webpackbar/commit/5dcd6bf))
* use compile instead of beforeCompile to prevent duplicate calls ([05cf301](https://github.com/nuxt/webpackbar/commit/05cf301))


### Features

* allow easily disabling reporters ([f96ad47](https://github.com/nuxt/webpackbar/commit/f96ad47))
* improve stats reporter ([09459af](https://github.com/nuxt/webpackbar/commit/09459af))
* rework bars reporter using a rewrite of log-update ([d918a9a](https://github.com/nuxt/webpackbar/commit/d918a9a))


### Reverts

* revert 100% check condition ([c2632ef](https://github.com/nuxt/webpackbar/commit/c2632ef))



<a name="3.0.0-1"></a>
# [3.0.0-1](https://github.com/nuxt/webpackbar/compare/v3.0.0-0...v3.0.0-1) (2018-11-02)


### Features

* **bars:** consola integration ([8db1118](https://github.com/nuxt/webpackbar/commit/8db1118))
* consola integration with bars ([1c22321](https://github.com/nuxt/webpackbar/commit/1c22321))
* use a shared throttle for bars ([91512c1](https://github.com/nuxt/webpackbar/commit/91512c1))



<a name="3.0.0-0"></a>
# [3.0.0-0](https://github.com/nuxt/webpackbar/compare/v2.6.3...v3.0.0-0) (2018-11-02)


### Bug Fixes

* avoid using null details ([c72c7c1](https://github.com/nuxt/webpackbar/commit/c72c7c1))
* fix hasRunning and and hasErrors ([2241cd7](https://github.com/nuxt/webpackbar/commit/2241cd7))
* fix imports ([226dbe2](https://github.com/nuxt/webpackbar/commit/226dbe2))
* fix utils ([9d60a17](https://github.com/nuxt/webpackbar/commit/9d60a17))
* handle hook errors ([c24b341](https://github.com/nuxt/webpackbar/commit/c24b341))
* handle reporter errors ([20e78c1](https://github.com/nuxt/webpackbar/commit/20e78c1))
* preserve start time and stats until next compile ([c93de65](https://github.com/nuxt/webpackbar/commit/c93de65))
* remove extra state field ([ab32217](https://github.com/nuxt/webpackbar/commit/ab32217))
* Remove unused dependencies ([#23](https://github.com/nuxt/webpackbar/issues/23)) ([2ab0dd2](https://github.com/nuxt/webpackbar/commit/2ab0dd2))
* **bars:** remove extra ending new line ([695fc56](https://github.com/nuxt/webpackbar/commit/695fc56))
* replace Object.values for node 6.x compability ([#17](https://github.com/nuxt/webpackbar/issues/17)) ([d004bb6](https://github.com/nuxt/webpackbar/commit/d004bb6))
* typos ([3b5c9cf](https://github.com/nuxt/webpackbar/commit/3b5c9cf))
* unshift built-in reporters ([007c9c5](https://github.com/nuxt/webpackbar/commit/007c9c5))
* update std-env to 2.1.0 ([e720ad8](https://github.com/nuxt/webpackbar/commit/e720ad8))


### Features

* reporters and draftlog ([6541a1c](https://github.com/nuxt/webpackbar/commit/6541a1c))
* support single reporter option ([0a10a08](https://github.com/nuxt/webpackbar/commit/0a10a08))


### Performance Improvements

* remove lodash dependency ([#22](https://github.com/nuxt/webpackbar/issues/22)) ([883a0dc](https://github.com/nuxt/webpackbar/commit/883a0dc))
* use text-table for less package size ([#22](https://github.com/nuxt/webpackbar/issues/22)) ([ea22b7b](https://github.com/nuxt/webpackbar/commit/ea22b7b))



<a name="2.6.3"></a>
## [2.6.3](https://github.com/nuxt/webpackbar/compare/v2.6.2...v2.6.3) (2018-08-18)



<a name="2.6.2"></a>
## [2.6.2](https://github.com/nuxt/webpackbar/compare/v2.6.1...v2.6.2) (2018-08-12)


### Bug Fixes

* ESLint is broken when using eslint-plugin-import ([783f243](https://github.com/nuxt/webpackbar/commit/783f243))



<a name="2.6.1"></a>
## [2.6.1](https://github.com/nuxt/webpackbar/compare/v2.6.0...v2.6.1) (2018-04-04)


### Bug Fixes

* fix ellipsis logic ([0fdb30f](https://github.com/nuxt/webpackbar/commit/0fdb30f))



<a name="2.6.0"></a>
# [2.6.0](https://github.com/nuxt/webpackbar/compare/v2.5.0...v2.6.0) (2018-04-04)


### Features

* cli improvements ([76d7306](https://github.com/nuxt/webpackbar/commit/76d7306))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/nuxt/webpackbar/compare/v2.4.0...v2.5.0) (2018-04-04)


### Features

* windows visual improvements ([2ae8339](https://github.com/nuxt/webpackbar/commit/2ae8339))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/nuxt/webpackbar/compare/v2.3.2...v2.4.0) (2018-04-01)


### Features

* add compile stats to the sharedState ([3973f6b](https://github.com/nuxt/webpackbar/commit/3973f6b))



<a name="2.3.2"></a>
## [2.3.2](https://github.com/nuxt/webpackbar/compare/v2.3.1...v2.3.2) (2018-03-31)


### Bug Fixes

* hot update for consola ([1d13980](https://github.com/nuxt/webpackbar/commit/1d13980))



<a name="2.3.1"></a>
## [2.3.1](https://github.com/nuxt/webpackbar/compare/v2.3.0...v2.3.1) (2018-03-31)


### Bug Fixes

* consola 1.1.1 ([b44fd11](https://github.com/nuxt/webpackbar/commit/b44fd11))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/nuxt/webpackbar/compare/v2.2.1...v2.3.0) (2018-03-31)


### Features

* **colorize:** try chalk built-in colors first ([73fd89e](https://github.com/nuxt/webpackbar/commit/73fd89e))



<a name="2.2.1"></a>
## [2.2.1](https://github.com/nuxt/webpackbar/compare/v2.2.0...v2.2.1) (2018-03-31)



<a name="2.2.0"></a>
# [2.2.0](https://github.com/nuxt/webpackbar/compare/v2.1.0...v2.2.0) (2018-03-31)


### Features

* consola integration ([d99f254](https://github.com/nuxt/webpackbar/commit/d99f254))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/nuxt/webpackbar/compare/v2.0.3...v2.1.0) (2018-03-31)


### Features

* show inactive parallel tasks ([2862002](https://github.com/nuxt/webpackbar/commit/2862002))



<a name="2.0.3"></a>
## [2.0.3](https://github.com/nuxt/webpackbar/compare/v2.0.2...v2.0.3) (2018-03-31)


### Bug Fixes

* honor options.stream everywhere ([34733b7](https://github.com/nuxt/webpackbar/commit/34733b7))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/nuxt/webpackbar/compare/v2.0.1...v2.0.2) (2018-03-31)


### Bug Fixes

* fix compiled message in minimal mode ([80f7ac2](https://github.com/nuxt/webpackbar/commit/80f7ac2))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/nuxt/webpackbar/compare/v2.0.0...v2.0.1) (2018-03-31)


### Bug Fixes

* fix cannot read property 'write' of undefined ([ccb1d65](https://github.com/nuxt/webpackbar/commit/ccb1d65))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/nuxt/webpackbar/compare/v1.5.1...v2.0.0) (2018-03-31)


### Features

* v2 rewrite ([5151960](https://github.com/nuxt/webpackbar/commit/5151960))


### BREAKING CHANGES

* behaviour and options changed. Refer to the new docs



<a name="1.5.1"></a>
## [1.5.1](https://github.com/nuxt/webpackbar/compare/v1.5.0...v1.5.1) (2018-03-28)


### Bug Fixes

* call done hook last ([642a9ef](https://github.com/nuxt/webpackbar/commit/642a9ef))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/nuxt/webpackbar/compare/v1.4.0...v1.5.0) (2018-03-28)


### Features

* options.buildTitle & consistent number of output lines ([1263fc1](https://github.com/nuxt/webpackbar/commit/1263fc1))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/nuxt/webpackbar/compare/v1.3.0...v1.4.0) (2018-03-28)


### Features

* accept done callback as an option ([30bfd1e](https://github.com/nuxt/webpackbar/commit/30bfd1e))
* better handling for 100% state and clear: false ([a2c823f](https://github.com/nuxt/webpackbar/commit/a2c823f))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/nuxt/webpackbar/compare/v1.2.1...v1.3.0) (2018-03-27)


### Features

* enabled option with smart defaults. ([0d22e4c](https://github.com/nuxt/webpackbar/commit/0d22e4c))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/nuxt/webpackbar/compare/v1.2.0...v1.2.1) (2018-03-27)


### Bug Fixes

* default clear to true ([528b769](https://github.com/nuxt/webpackbar/commit/528b769))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/nuxt/webpackbar/compare/v1.1.4...v1.2.0) (2018-03-27)


### Features

* new options: stream, profile, clear and showCursor. ([#3](https://github.com/nuxt/webpackbar/issues/3)) ([80f5f17](https://github.com/nuxt/webpackbar/commit/80f5f17))
* support hex colors. ([#2](https://github.com/nuxt/webpackbar/issues/2)) ([1c7cc0b](https://github.com/nuxt/webpackbar/commit/1c7cc0b))



<a name="1.1.4"></a>
## [1.1.4](https://github.com/nuxt/webpackbar/compare/v1.1.3...v1.1.4) (2018-03-26)


### Bug Fixes

* webpack 3 compability ([#1](https://github.com/nuxt/webpackbar/issues/1)) ([ff24c14](https://github.com/nuxt/webpackbar/commit/ff24c14))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/nuxt/webpackbar/compare/v1.1.2...v1.1.3) (2018-03-24)


### Bug Fixes

* remove debug ([a27a83c](https://github.com/nuxt/webpackbar/commit/a27a83c))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/nuxt/webpackbar/compare/v1.1.1...v1.1.2) (2018-03-24)


### Bug Fixes

* **profile:** ignore requests without any file or loaders ([d3eb446](https://github.com/nuxt/webpackbar/commit/d3eb446))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/nuxt/webpackbar/compare/v1.1.0...v1.1.1) (2018-03-24)



<a name="1.1.0"></a>
# [1.1.0](https://github.com/nuxt/webpackbar/compare/v1.0.0...v1.1.0) (2018-03-24)


### Features

* build profiler ([0c05d65](https://github.com/nuxt/webpackbar/commit/0c05d65))



<a name="1.0.0"></a>
# 1.0.0 (2018-03-24)



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

x.x.x / <year>-<month>-<day>
==================

  * Bug fix -
  * Feature -
  * Chore -
  * Docs -
