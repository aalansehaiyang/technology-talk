const { resolve } = require('path')
const stringify = require('@shigma/stringify-object')

module.exports = (options, context) => ({
  name: 'vuepress-plugin-copyright',

  alias: {
    '@clipboardComponent': typeof options.clipboardComponent === 'string'
      ? resolve(context.sourceDir, options.clipboardComponent)
      : resolve(__dirname, 'Clipboard.vue'),
  },

  clientRootMixin: resolve(__dirname, 'rootMixin.js'),

  clientDynamicModules () {
    const {
      noCopy = false,
      noSelect = false,
      disabled = false,
      minLength = 0,
      authorName = '',
    } = options

    return {
      name: 'copyright-options.js',
      content: `export default ${stringify({
        noCopy,
        noSelect,
        disabled,
        minLength,
        authorName,
      })}`,
    }
  },
})
