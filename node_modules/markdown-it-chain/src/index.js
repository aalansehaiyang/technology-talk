const ChainedMap = require('webpack-chain/src/ChainedMap')
const Plugin = require('./Plugin')
const Options = require('./Options')

module.exports = class MarkdownItChain extends ChainedMap {
  constructor () {
    super()
    this.options = new Options(this)
    this.plugins = new ChainedMap(this)
  }

  toConfig () {
    return this.clean(Object.assign(this.entries() || {}, {
      options: this.options.entries(),
      plugins: this.plugins.values().map(plugin => plugin.toConfig())
    }))
  }

  plugin (name) {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, new Plugin(this))
    }

    return this.plugins.get(name)
  }

  toMd (markdownIt, instantiationOptions = {}) {
    const { options, plugins } = this.toConfig()
    if (!markdownIt) {
      try {
        markdownIt = require.resolve('markdown-it')
      } catch (e) {
        throw new Error('Failed to detect markdown-it has been installed')
      }
      markdownIt = require(markdownIt)
    }
    const md = markdownIt(Object.assign(instantiationOptions, options))
    return plugins.reduce((md, { plugin, args }) => md.use(plugin, ...args), md)
  }
}
