var path = require('path');
var fs = require('fs');

var Evaluator = require('stylus/lib/visitor/evaluator');
var loaderUtils = require('loader-utils');
var nodes = require('stylus/lib/nodes');
var utils = require('stylus/lib/utils');
var when = require('when');
var whenNodefn = require('when/node/function');

var listImports = require('./listimports');

module.exports = PathCache;

var readFile = whenNodefn.lift(fs.readFile);

// A cache of import paths of a stylus file resolved to their location on disk
// before the stylus file is rendered. With a special evaluator this lets us
// webpack's resolver.
function PathCache(contexts, sources, imports) {
  this.contexts = contexts;
  this.sources = sources;
  this.imports = imports;

  // Non relative paths are simpler and looked up in this as a fallback
  // to this.context.
  this.simpleContext = {};
  for (var dirname in this.contexts) {
    for (var path in this.contexts[dirname]) {
      this.simpleContext[path] = this.contexts[dirname][path];
    }
  }
}

// Return a promise for a PathCache.
PathCache.create = function(contexts, sources, imports) {
  return when(new PathCache(contexts, sources, imports));
};
PathCache.createFromFile = resolveFileDeep;

// Create a list of ways to resolve paths.
PathCache.resolvers = resolvers;

PathCache.resolvers.reduce = reduceResolvers;

// Lookup the path in this cache.
PathCache.prototype.find = function(path, dirname) {
  if (this.contexts[dirname] && this.contexts[dirname][path]) {
    return this.contexts[dirname][path].path;
  } else if (this.simpleContext[path]) {
    return this.simpleContext[path].path;
  } else if (/.styl$/.test(path)) {
    // A user can specify @import 'something.styl' but if they specify
    // @import 'something' stylus adds .styl, we drop that here to see if we
    // looked for it without .styl.
    return this.find(path.replace(/.styl$/, ''), dirname);
  } else {
    return undefined;
  }
};

// Return if the path in this cache is an index file.
PathCache.prototype.isIndex = function(path, dirname) {
  if (this.contexts[dirname] && this.contexts[dirname][path]) {
    return this.contexts[dirname][path].index;
  } else {
    return undefined;
  }
};

// Return an array of all imports the original file depends on.
PathCache.prototype.allDeps = function() {
  var deps = [];
  for (var dirname in this.contexts) {
    for (var path in this.contexts[dirname]) {
      if (this.contexts[dirname][path]) {
        deps = deps.concat(this.contexts[dirname][path].path);
      }
    }
  }
  return deps;
};

// Create an array of ways to resolve a path.
//
// The resolved paths may be a path or an object specifying path and index
// members. The index member is used later by stylus, we store it at this point.
function resolvers(options, webpackResolver) {
  var evaluator = new Evaluator(nodes.null, options);
  var whenWebpackResolver = whenNodefn.lift(webpackResolver);

  // Stylus's normal resolver for single files.
  var stylusFile = function(context, path) {
    // Stylus adds .styl to paths for normal "paths" lookup if it isn't there.
    if (!/.styl$/.test(path)) {
      path += '.styl';
    }

    var paths = options.paths.concat(context);
    var found = utils.find(path, paths, options.filename)
    if (found) {
      return normalizePaths(found);
    }
  };

  // Stylus's normal resolver for node_modules packages. Cannot locate paths
  // inside a package.
  var stylusIndex = function(context, path) {
    // Stylus calls the argument name. If it exists it should match the name
    // of a module in node_modules.
    if (!path) {
      return null;
    }

    var paths = options.paths.concat(context);
    var found = utils.lookupIndex(path, paths, options.filename);
    if (found) {
      return {path: normalizePaths(found), index: true};
    }
  };

  // Fallback to resolving with webpack's configured resovler.
  var webpackResolve = function(context, path) {
    // Follow the webpack stylesheet idiom of '~path' meaning a path in a
    // modules folder and a unprefixed 'path' meaning a relative path like
    // './path'.
    path = loaderUtils.urlToRequest(path, options.root);
    // First try with a '.styl' extension.
    return whenWebpackResolver(context, path + '.styl')
      // If the user adds ".styl" to resolve.extensions, webpack can find
      // index files like stylus but it uses all of webpack's configuration,
      // by default for example the module could be web_modules.
      .catch(function() { return whenWebpackResolver(context, path); })
      .catch(function() { return null; })
      .then(function(result) {
        return Array.isArray(result) && result[1] && result[1].path || result
      });
  };

  if (options.preferPathResolver === 'webpack') {
    return [
      webpackResolve,
      stylusFile,
      stylusIndex
    ];
  }
  else {
    return [
      stylusFile,
      stylusIndex,
      webpackResolve
    ];
  }
}

function reduceResolvers(resolvers, context, path) {
  return when
    .reduce(resolvers, function(result, resolver) {
      return result ? result : resolver(context, path);
    }, undefined);
}

// Run resolvers on one path and return an object with the found path under a
// key of the original path.
//
// Example:
// resolving the path
//   'a/file'
// returns an object
//   {'a/file': {path: ['node_modules/a/file'], index: true}}
function resolveOne(resolvers, context, path) {
  return reduceResolvers(resolvers, context, path)
    .then(function(result) {
      result = typeof result === 'string' ? [result] : result;
      result = Array.isArray(result) ? {path: result, index: false} : result;
      var map = {};
      map[path] = result;
      return map;
    });
}

// Run the resolvers on an array of paths and return an object like resolveOne.
function resolveMany(resolvers, context, paths) {
  return when
    .map(paths, resolveOne.bind(null, resolvers, context))
    .then(function(maps) {
      return maps.reduce(function(map, resolvedPaths) {
        Object.keys(resolvedPaths).forEach(function(path) {
          map[path] = resolvedPaths[path];
        });
        return map;
      }, {});
    });
}

// Load a file at fullPath, resolve all of it's imports and report for those.
function resolveFileDeep(helpers, parentCache, source, fullPath) {
  var resolvers = helpers.resolvers;
  var readFile = helpers.readFile;

  var contexts = parentCache.contexts;
  var sources = parentCache.sources;

  contexts = contexts || {};
  var nestResolve = resolveFileDeep.bind(null, helpers, parentCache, null);
  var context = path.dirname(fullPath);
  readFile = whenNodefn.lift(readFile);

  return when
    .resolve(source || sources[fullPath] || readFile(fullPath))
    // Cast the buffer from the cached input file system to a string.
    .then(String)
    // Store the source so that the evaluator doesn't need to touch the
    // file system.
    .then(function(_source) {
      sources[fullPath] = _source;
      return _source;
    })
    // Make sure the stylus functions/index.styl source is stored.
    .then(partial(ensureFunctionsSource, sources))
    // List imports and use its cache. The source file is translated into a
    // list of imports. Where the source file came from isn't important for the
    // list. The where is added by resolveMany with the context and resolvers.
    .then(partialRight(listImports, { cache: parentCache.imports }))
    .then(resolveMany.bind(null, resolvers, context))
    .then(function(newPaths) {
      // Contexts are the full path since multiple could be in the same folder
      // but different deps.
      contexts[context] = merge(contexts[context] || {}, newPaths);
      return when.map(Object.keys(newPaths), function(key) {
        var found = newPaths[key] && newPaths[key].path;
        if (found) {
          return when.map(found, nestResolve);
        }
      });
    })
    .then(function() {
      return PathCache.create(contexts, sources, parentCache.imports);
    });
}

// Resolve functions in a promise wrapper to catch any errors from resolving.
var functionsPath =
  new when.Promise(function(resolve) {
    resolve(require.resolve('stylus/lib/functions/index.styl'));
  })
  .catch(function() { return ''; });

var functionsSource = functionsPath
  .then(readFile)
  .catch(function(error) {
    // Ignore error if functions/index.styl doesn't exist.
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return '';
  })
  .then(String);

function ensureFunctionsSource(sources, source) {
  if (!sources[functionsPath]) {
    return functionsSource
      .then(function(functionsSource) {
        if (functionsSource) {
          sources[functionsPath] = functionsSource;
        }
      })
      // Pass through the source given to this function.
      .yield(source);
  }
  // Pass through the source given to this function.
  return source;
}

var slice = Array.prototype.slice.call.bind(Array.prototype.slice);

function merge(a, b) {
  var key;
  for (key in b) {
    a[key] = b[key];
  }
  return a;
}

function partial(fn) {
  var args = slice(arguments, 1);
  return function() {
    return fn.apply(this, args.concat(slice(arguments)));
  };
}

function partialRight(fn) {
  var args = slice(arguments, 1);
  return function() {
    return fn.apply(this, slice(arguments).concat(args));
  };
}

function normalizePaths(paths) {
  for(var i in paths) {
    paths[i] = path.normalize(paths[i]);
  }
  return paths;
}