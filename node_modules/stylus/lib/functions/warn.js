var utils = require('../utils')
  , nodes = require('../nodes');

/**
 * Warn with the given `msg` prefixed by "Warning: ".
 *
 * @param {String} msg
 * @api public
 */

function warn(msg){
  utils.assertType(msg, 'string', 'msg');
  console.warn('Warning: %s', msg.val);
  return nodes.null;
}
warn.params = ['msg'];
module.exports = warn;
