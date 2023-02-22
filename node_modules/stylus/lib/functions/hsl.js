var utils = require('../utils')
  , nodes = require('../nodes')
  , hsla = require('./hsla');

/**
 * Convert the given `color` to an `HSLA` node,
 * or h,s,l component values.
 *
 * Examples:
 *
 *    hsl(10, 50, 30)
 *    // => HSLA
 *
 *    hsl(#ffcc00)
 *    // => HSLA
 *
 * @param {Unit|HSLA|RGBA} hue
 * @param {Unit} saturation
 * @param {Unit} lightness
 * @return {HSLA}
 * @api public
 */

function hsl(hue, saturation, lightness){
  if (1 == arguments.length) {
    utils.assertColor(hue, 'color');
    return hue.hsla;
  } else {
    return hsla(
        hue
      , saturation
      , lightness
      , new nodes.Unit(1));
  }
};
hsl.params = ['hue', 'saturation', 'lightness'];
module.exports = hsl;
