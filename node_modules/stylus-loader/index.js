var loaderUtils = require('loader-utils');
var stylus = require('stylus');
var path = require('path');
var fs = require('fs');
var when = require('when');
var whenNodefn = require('when/node/function');
var cloneDeep = require('lodash.clonedeep');

var CachedPathEvaluator = require('./lib/evaluator');
var PathCache = require('./lib/pathcache');
var resolver = require('./lib/resolver');

var globalImportsCaches = {};
module.exports = function(source) {
  var self = this;
  this.cacheable && this.cacheable();
  var done = this.async();
  var options = cloneDeep(loaderUtils.getOptions(this) || {});
  options.dest = options.dest || '';
  options.filename = options.filename || this.resourcePath;
  options.Evaluator = CachedPathEvaluator;

  var configKey, stylusOptions;
  if (this.stylus) {
    configKey = options.config || 'default';
    stylusOptions = this.stylus[configKey] || {};
  } else if (this.options) {
    configKey = options.config || 'stylus';
    stylusOptions = this.options[configKey] || {};
  } else {
    stylusOptions = {};
  }
  // Instead of assigning to options, we run them manually later so their side effects apply earlier for
  // resolving paths.
  var use = options.use || stylusOptions.use || [];
  options.import = options.import || stylusOptions.import || [];
  options.include = options.include || stylusOptions.include || [];
  options.set = options.set || stylusOptions.set || {};
  options.define = options.define || stylusOptions.define || {};
  options.paths = options.paths || stylusOptions.paths;

  if (options.sourceMap != null) {
    options.sourcemap = options.sourceMap;
    delete options.sourceMap;
  }
  else if (this.sourceMap) {
    options.sourcemap = { comment: false };
  }

  var styl = stylus(source, options);
  var paths = [path.dirname(options.filename)];

  function needsArray(value) {
    return (Array.isArray(value)) ? value : [value];
  }

  if (options.paths && !Array.isArray(options.paths)) {
    paths = paths.concat(options.paths);
    options.paths = [options.paths];
  }

  var manualImports = [];
  Object.keys(options).forEach(function(key) {
    var value = options[key];
    if (key === 'use') {
      needsArray(value).forEach(function(plugin) {
        if (typeof plugin === 'function') {
          styl.use(plugin);
        } else {
          throw new Error('Plugin should be a function');
        }
      });
    } else if (key === 'set') {
      for (var name in value) {
        styl.set(name, value[name]);
      }
    } else if (key === 'define') {
      for (var defineName in value) {
        styl.define(defineName, value[defineName]);
      }
    } else if (key === 'include') {
      needsArray(value).forEach(styl.include.bind(styl));
    } else if (key === 'import') {
      needsArray(value).forEach(function(stylusModule) {
        manualImports.push(stylusModule);
      });
    } else {
      styl.set(key, value);

      if (key === 'resolve url' && value) {
        styl.define('url', resolver());
      }
    }
  });

  var shouldCacheImports = stylusOptions.importsCache !== false;

  var importsCache;
  if (stylusOptions.importsCache !== false) {
    if (typeof stylusOptions.importsCache === 'object') {
      importsCache = stylusOptions.importsCache;
    } else {
      if(!globalImportsCaches[configKey]) globalImportsCaches[configKey] = {};
      importsCache = globalImportsCaches[configKey];
    }
  }

  // Use input file system's readFile if available. The normal webpack input
  // file system is cached with entries purged when they are detected to be
  // changed on disk by the watcher.
  var readFile;
  try {
    var inputFileSystem = this._compiler.inputFileSystem;
    readFile = inputFileSystem.readFile.bind(inputFileSystem);
  } catch (error) {
    readFile = fs.readFile;
  }

  var boundResolvers = PathCache.resolvers(options, this.resolve);
  var pathCacheHelpers = {
    resolvers: boundResolvers,
    readFile: readFile,
  };

  // Use plugins here so that resolve related side effects can be used while we resolve imports.
  (Array.isArray(use) ? use : [use]).forEach(styl.use, styl);

  when
    // Resolve manual imports like @import files.
    .reduce(manualImports, function resolveManualImports(carry, filename) {
      return PathCache.resolvers
        .reduce(boundResolvers, path.dirname(options.filename), filename)
        .then(function(paths) { return carry.concat(paths); });
    }, [])
    // Resolve dependencies of
    .then(function(paths) {
      paths.forEach(styl.import.bind(styl));
      paths.forEach(self.addDependency);

      var readFile = whenNodefn.lift(pathCacheHelpers.readFile);
      return when.reduce(paths, function(cache, filepath) {
        return readFile(filepath)
          .then(function(source) {
            return PathCache.createFromFile(
              pathCacheHelpers, cache, source.toString(), filepath
            );
          });
      }, {
        contexts: {},
        sources: {},
        imports: importsCache,
      });
    })
    .then(function(cache) {
      return PathCache
        .createFromFile(pathCacheHelpers, cache, source, options.filename);
    })
    .then(function(importPathCache) {
      // CachedPathEvaluator will use this PathCache to find its dependencies.
      options.cache = importPathCache;
      importPathCache.allDeps().forEach(function(f) {
        self.addDependency(path.normalize(f));
      });

      // var paths = importPathCache.origins;

      styl.render(function(err, css) {
        if (err) {
          done(err);
        } else {
          if (styl.sourcemap) {
            styl.sourcemap.sourcesContent = styl.sourcemap.sources.map(function (file) {
              return importPathCache.sources[path.resolve(file)]
            });
          }
          done(null, css, styl.sourcemap);
        }
      });
    })
    .catch(done);
};

var LoaderOptionsPlugin = require('webpack').LoaderOptionsPlugin;

// Webpack 2 plugin for setting options that'll be available to stylus-loader.
function OptionsPlugin(options) {
  if (!LoaderOptionsPlugin) {
    throw new Error(
      'webpack.LoaderOptionPlugin is not available. A newer version of webpack is needed.'
    );
  }
  var stylusOptions = {};
  var test = options.test || /\.styl$/;
  var include = options.include;
  var exclude = options.exclude;

  var loaderOptions = {
    stylus: stylusOptions,
  };
  for (var key in options) {
    if (['test', 'include', 'exclude'].indexOf(key) === -1) {
      stylusOptions[key] = options[key];
    }
  }
  if (test) {
    loaderOptions.test = test;
  }
  if (include) {
    loaderOptions.include = include;
  }
  if (exclude) {
    loaderOptions.exclude = exclude;
  }
  this.plugin = new LoaderOptionsPlugin(loaderOptions);
};

module.exports.OptionsPlugin = OptionsPlugin;

OptionsPlugin.prototype.apply = function(compiler) {
  this.plugin.apply(compiler);
};
