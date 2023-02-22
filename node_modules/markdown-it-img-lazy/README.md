# markdown-it-img-lazy

> a markdown-it plugin to better supporting image lazy loading

**The plugin will preferentially use native image [lazy-loading](https://caniuse.com/#feat=loading-lazy-attr), if the browser does not support it, it will be implemented through lozad**

---

## Installation

``` sh
yarn add markdown-it-img-lazy
# or
npm i markdown-it-img-lazy
```

## Usage

``` js
md.use(require('markdown-it-img-lazy'), /* Options */)
```
**then you need**

load [Lozad.js](https://github.com/ApoorvSaxena/lozad.js) in the head tag of your page

load [imgLazy.js](https://github.com/tolking/markdown-it-img-lazy/blob/master/imgLazy.js) closer the `</body>` tag of your page

``` md
![img](/img.jpg)
```

## Options

### useNative
- Type: `Boolean`
- Default: `true`
- Required: `false`

Use the native image [lazy-loading](https://caniuse.com/#feat=loading-lazy-attr) for the web

```
if useNative = true
![img](img.jpg) -> <p><img alt="img" data-src="img.jpg" loading="lazy" class="lazy"></p>

if useNative = false
![img](img.jpg) -> <p><img alt="img" data-src="img.jpg" class="lazy"></p>
```

### selector
- Type: `string`
- Default: `lazy`
- Required: `false`

Default class name for image

### prefix
- Type: `string` `Function`
- Default: `''`
- Required: `false`

Config prefix for src in images
