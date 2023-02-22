const ChainedMap = require('webpack-chain/src/ChainedMap')

module.exports = class extends ChainedMap {
  constructor (parent) {
    super(parent)

    this.extend([
      'html',
      'xhtmlOut',
      'breaks',
      'langPrefix',
      'linkify',
      'typographer',
      'quotes',
      'highlight'
    ])
  }
}
