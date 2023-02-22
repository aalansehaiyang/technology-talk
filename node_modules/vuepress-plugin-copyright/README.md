# [vuepress-plugin-copyright](https://vuepress.github.io/plugins/copyright/)

[![npm](https://img.shields.io/npm/v/vuepress-plugin-copyright.svg)](https://www.npmjs.com/package/vuepress-plugin-copyright)

`vuepress-plugin-copyright` is a [VuePress](https://vuepress.vuejs.org/) plugin that handles copy behaviors.

## Usage

### Global Installation

```bash
npm install -g vuepress-plugin-copyright
# OR
yarn global add vuepress-plugin-copyright
```

### Local Installation

```bash
npm install vuepress-plugin-copyright
# OR
yarn add vuepress-plugin-copyright
```

### Add to `config.js`

```js
module.exports = {
  plugins: [
    ['copyright', {
      noCopy: true,   // the selected text will be uncopiable
      minLength: 100, // if its length is greater than 100
    }],
  ]
}
```
or
```js
module.exports = {
  plugins: {
    copyright: {
      // disable the plugin by default
      // you can activate the plugin in frontmatter
      disabled: true,
      // texts will be unselectable
      noSelect: true,
    },
  }
}
```

### Use Frontmatter

You can enable or disable this plugin for the current page in frontmatter:

```yaml
---
copyright: false # disable the plugin in this page
---
```

You can also do some local configuration:

```yaml
---
copyright:
  minLength: 40 # It will override global configuration.
---
```

### Custom Clipboard

You can customize your clipboard with [`clipboardComponent`](#clipboardcomponent). Here is a simple example:

```vue
<template>
  <div>
    <p>
      Copyright © VuePress Community
      Link: <a :href="location">{{ location }}</a>
    </p>
    <div v-html="html"/>
  </div>
</template>

<script>

export default {
  props: ['html'],

  created () {
    this.location = window.location
  },
}

</script>
```

## Configurations

Options marked with <Badge text="frontmatter" vertical="bottom"/>are also allowed in [frontmatter](#frontmatter). Options marked with <Badge text="default" vertical="bottom"/>only take effect when the default clipboard component is used.

### disabled

- **type:** `boolean`
- **default:** `false`

Whether to disable this plugin by default.

### noCopy <Badge text="frontmatter"/>

- **type:** `boolean`
- **default:** `false`

Whether to prohibit copying.

### noSelect <Badge text="frontmatter"/>

- **type:** `boolean`
- **default:** `false`

Whether to prohibit selecting.

### minLength <Badge text="frontmatter"/>

- **type:** `number`
- **default:** `0`

The minimum text length that triggers the clipboard component or the [`noCopy`](#nocopy) effect.

### authorName <Badge text="default"/>

- **type:** `string | Record<string, string>`
- **default:** `'Author'`

Author name. You can provide a string or an i18n object, for example:

```json
{
  "en-US": "Author",
  "zh-CN": "作者"
}
```

### clipboardComponent

- **type:** `string`
- **default:** `undefined`

The path to the [custom clipboard](#custom-clipboard) component. If a relative path is specified, it will be resolved based on `sourceDir`.
