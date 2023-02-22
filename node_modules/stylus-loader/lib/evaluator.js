// Except for a block in #visitImport, everything here is an exact copy of the
// source in stylus this currently depends on. If stylus is updated, update
// this appropriately.

var Evaluator = require('stylus/lib/visitor/evaluator')
  , nodes = require('stylus/lib/nodes')
  , Stack = require('stylus/lib/stack')
  , Frame = require('stylus/lib/stack/frame')
  , Scope = require('stylus/lib/stack/scope')
  , utils = require('stylus/lib/utils')
  , bifs = require('stylus/lib/functions')
  , basename = require('path').basename
  , dirname = require('path').dirname
  , relative = require('path').relative
  , join = require('path').join
  , colors = require('stylus/lib/colors')
  // , debug = require('debug')('stylus:evaluator')
  , fs = require('fs');

module.exports = CachedPathEvaluator;

/**
 * Import `file` and return Block node.
 *
 * @api private
 */
function importFile(node, file, literal, index) {
  var importStack = this.importStack
    , Parser = require('stylus/lib/parser')
    , stat;

  // Handling the `require`
  if (node.once) {
    if (this.requireHistory[file]) return nodes.null;
    this.requireHistory[file] = true;

    if (literal && !this.includeCSS) {
      return node;
    }
  }

  // Expose imports
  node.path = file;
  node.dirname = dirname(file);
  // Store the modified time
  stat = fs.statSync(file);
  node.mtime = stat.mtime;
  this.paths.push(node.dirname);

  // Avoid overflows from importing the same file over again
  if (file === importStack[importStack.length - 1]) return nodes.null;

  if (this.options._imports) this.options._imports.push(node.clone());

  // Parse the file
  importStack.push(file);
  nodes.filename = file;

  var str;
  if (this.cache.sources && this.cache.sources[file]) {
    str = this.cache.sources[file];
  } else {
    str = fs.readFileSync(file, 'utf8');
  }

  if (literal && !this.resolveURL) return new nodes.Literal(str.replace(/\r\n?/g, '\n'));

  // parse
  var block = new nodes.Block
    , parser = new Parser(str, utils.merge({ root: block }, this.options));

  try {
    block = parser.parse();
  } catch (err) {
    err.filename = file;
    err.lineno = parser.lexer.lineno;
    err.input = str;
    throw err;
  }

  // Evaluate imported "root"
  block.parent = this.root;
  block.scope = false;
  var ret = this.visit(block);
  importStack.pop();
  if (importStack.length || index) this.paths.pop();

  return ret;
}

function CachedPathEvaluator(root, options) {
  Evaluator.apply(this, arguments);

  this.cache = options.cache;
}

CachedPathEvaluator.prototype = Object.create(Evaluator.prototype);
CachedPathEvaluator.prototype.constructor = CachedPathEvaluator;

CachedPathEvaluator.prototype.visitImport = function(imported) {
  this.return++;

  var path = this.visit(imported.path).first
    , nodeName = imported.once ? 'require' : 'import'
    , found
    , literal
    , index;

  this.return--;
  // debug('import %s', path);

  // url() passed
  if ('url' == path.name) {
    if (imported.once) throw new Error('You cannot @require a url');

    return imported;
  }

  // Ensure string
  if (!path.string) throw new Error('@' + nodeName + ' string expected');

  var name = path = path.string;

  // Absolute URL
  if (/url\s*\(\s*['"]?(?:https?:)?\/\//i.test(path)) {
    if (imported.once) throw new Error('You cannot @require a url');
    return imported;
  }

  // Literal
  if (/\.css(?:"|$)/.test(path)) {
    literal = true;
    if (!imported.once && !this.includeCSS) {
      return imported;
    }
  }

  // support optional .styl
  if (!literal && !/\.styl$/i.test(path)) path += '.styl';

  /*****************************************************************************
  * THIS IS THE ONLY BLOCK THAT DIFFERS FROM THE ACTUAL STYLUS IMPLEMENTATION. *
  *****************************************************************************/
  // Lookup
  var dirname = this.paths[this.paths.length - 1];
  found = this.cache.find(path, dirname);
  index = this.cache.isIndex(path, dirname);
  if (!found) {
    found = utils.find(path, this.paths, this.filename);
    if (!found) {
      found = utils.lookupIndex(name, this.paths, this.filename);
      index = true;
    }
  }

  // Throw if import failed
  if (!found) throw new Error('failed to locate @' + nodeName + ' file ' + path);

  var block = new nodes.Block;

  for (var i = 0, len = found.length; i < len; ++i) {
    block.push(importFile.call(this, imported, found[i], literal, index));
  }

  return block;
}
