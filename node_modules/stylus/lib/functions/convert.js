var utils = require('../utils');

/**
 * Like `unquote` but tries to convert
 * the given `str` to a Stylus node.
 *
 * @param {String} str
 * @return {Node}
 * @api public
 */

function convert(str){
  utils.assertString(str, 'str');
  return utils.parseString(str.string);
};
convert.params = ['str'];
module.exports = convert;
