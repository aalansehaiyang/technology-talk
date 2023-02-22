var utils = require('../utils')
  , path = require('path');

/**
 * Return the extname of `path`.
 *
 * @param {String} path
 * @return {String}
 * @api public
 */

function extname(p){
  utils.assertString(p, 'path');
  return path.extname(p.val);
};
extname.params = ['p'];
module.exports = extname;
