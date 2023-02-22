const ChainedMap = require('webpack-chain/src/ChainedMap')
const Orderable = require('webpack-chain/src/Orderable')

module.exports = Orderable(class Plugin extends ChainedMap {
  constructor (parent) {
    super(parent)
    this.extend(['init'])

    this.init((plugin, args = []) => ({ plugin, args }))
  }

  use (plugin, args = []) {
    return this
      .set('plugin', plugin)
      .set('args', args)
  }

  tap (f) {
    this.set('args', f(this.get('args') || []))
    return this
  }

  merge (obj, omit = []) {
    if ('plugin' in obj) {
      this.set('plugin', obj.plugin)
    }

    if ('args' in obj) {
      this.set('args', obj.args)
    }

    return super.merge(obj, [...omit, 'args', 'plugin'])
  }

  toConfig () {
    const init = this.get('init')

    return init(this.get('plugin'), this.get('args'))
  }
})
