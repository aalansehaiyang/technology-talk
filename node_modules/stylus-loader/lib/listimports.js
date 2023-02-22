var Parser = require('stylus/lib/parser');
var Visitor = require('stylus/lib/visitor');
var nodes = require('stylus/lib/nodes');

module.exports = listImports;

// ImportVisitor is a simple stylus ast visitor that navigates the graph
// building a list of imports in it.
function ImportVisitor() {
  Visitor.apply(this, arguments);
  this.importPaths = [];
}

ImportVisitor.prototype = Object.create(Visitor.prototype);
ImportVisitor.prototype.constructor = ImportVisitor;

ImportVisitor.prototype.visitImport = function(node) {
  this.importPaths.push(node.path.first.string);
  return node;
};

ImportVisitor.prototype.visitRoot = function(block){
  for (var i = 0; i < block.nodes.length; ++i) {
    this.visit(block.nodes[i]);
  }
  return block;
};

ImportVisitor.prototype.visitExpression = function(expr) {
  for (var i = 0; i < expr.nodes.length; ++i) {
    this.visit(expr.nodes[i]);
  }
  return expr;
};

ImportVisitor.prototype.visitCall = function(fn) {
  if (fn.name === 'use' || fn.name === 'json') {
    this.importPaths.push(fn.args.first.string);
  }
  return fn;
};

ImportVisitor.prototype.visitSelector = function(sel) {
  for (var i = 0; i < sel.block.nodes.length; i++) {
    this.visit(sel.block.nodes[i]);
  }
  return sel;
}

ImportVisitor.prototype.visitBlock = ImportVisitor.prototype.visitRoot;
ImportVisitor.prototype.visitGroup = ImportVisitor.prototype.visitRoot;

// Returns a list of paths that given source imports.
function listImports(source, options) {
  // Store source -> imports work in a cache. The Parser is the most expensive
  // part of stylus and we can't use their cache without creating undesired side
  // effects later during the actual render. In single run builds this will
  // benefit repeated files imported like common styling. In multiple run builds
  // this will help stylus import trees when a dependency changes, the higher up
  // files won't need to be parsed again.
  var cache = options.cache;
  if (cache && cache[source]) { return cache[source]; }

  // Current idea here is to silence errors and let them rise in stylus's
  // renderer which has more handling so that the error message is more
  // meaningful and easy to understand.
  try {
    var ast = new Parser(source, { cache: false }).parse();
  } catch (e) {
    return [];
  }
  var importVisitor = new ImportVisitor(ast, {});
  importVisitor.visit(ast);

  if (cache) {
    cache[source] = importVisitor.importPaths;
  }

  return importVisitor.importPaths;
}
