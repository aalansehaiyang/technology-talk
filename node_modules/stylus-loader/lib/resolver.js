// This implementation of the url resolver adds awareness for webpack loaders
/*

Modified from the stylus implementation:

(The MIT License)

Copyright (c) 2010–2014 LearnBoost <dev@learnboost.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*jshint laxcomma:true */
var Stylus = require('stylus')
    , Compiler = Stylus.Compiler
    , nodes = Stylus.nodes
    , utils = Stylus.utils
  , parse = require('url').parse
  , relative = require('path').relative
  , dirname = require('path').dirname
  , extname = require('path').extname
  , sep = require('path').sep;

/**
 * Return a url() function with the given `options`.
 *
 * Options:
 *
 *    - `paths` resolution path(s), merged with general lookup paths
 *
 * Examples:
 *
 *    stylus(str)
 *      .set('filename', __dirname + '/css/test.styl')
 *      .define('url', stylus.resolver({ paths: [__dirname + '/public'] }))
 *      .render(function(err, css){ ... })
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function(options) {
  options = options || {};

  var _paths = options.paths || [];

  function url(url) {
    var paths = _paths.concat(this.paths),
        filename = this.filename;

    // Compile the url
    var compiler = new Compiler(url);
    compiler.isURL = true;
    url = url.nodes.map(function(node){
      return compiler.visit(node);
    }).join('');

    function resolveComponent(url) {
      if (!url) {
        return url;
      }

      url = parse(url);
      if (url.protocol) {
        return url.href;
      }

      // Lookup
      var found = utils.lookup(url.pathname, paths, '', true);
      if (!found) {
        return url.href;
      }

      var tail = '';
      if (url.search) {
        tail += url.search;
      }
      if (url.hash) {
        tail += url.hash;
      }

      var res = relative(dirname(filename), found) + tail;
      if ('\\' == sep) res = res.replace(/\\/g, '/');
      return res;
    }

    var components = url.split(/!/g);
    components = components.map(resolveComponent);
    return new nodes.Literal('url("' + components.join('!') + '")');
  }

  url.raw = true;
  return url;
};
