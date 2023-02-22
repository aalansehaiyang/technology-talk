var utils = require('../utils');

/**
 * Throw an error with the given `msg`.
 *
 * @param {String} msg
 * @api public
 */

function error(msg){
  utils.assertType(msg, 'string', 'msg');
  var err = new Error(msg.val);
  err.fromStylus = true;
  throw err;
};
error.params = ['msg'];
module.exports = error;
