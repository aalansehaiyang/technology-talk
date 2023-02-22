var nodes = require('../nodes');

/**
 * Get Math `prop`.
 *
 * @param {String} prop
 * @return {Unit}
 * @api private
 */

function math(prop){
  return new nodes.Unit(Math[prop.string]);
}
math.params = ['prop'];
module.exports = math;
