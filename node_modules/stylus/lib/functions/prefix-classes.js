var utils = require('../utils');

/**
 * Prefix css classes in a block
 *
 * @param {String} prefix
 * @param {Block} block
 * @return {Block}
 * @api private
 */

function prefixClasses(prefix, block){
  utils.assertString(prefix, 'prefix');
  utils.assertType(block, 'block', 'block');

  var _prefix = this.prefix;

  this.options.prefix = this.prefix = prefix.string;
  block = this.visit(block);
  this.options.prefix = this.prefix = _prefix;
  return block;
}
prefixClasses.params = ['prefix', 'block'];
module.exports = prefixClasses;
