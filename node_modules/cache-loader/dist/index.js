"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
exports.pitch = pitch;
exports.raw = void 0;

/* eslint-disable
  import/order
*/
const fs = require('fs');

const os = require('os');

const path = require('path');

const async = require('neo-async');

const crypto = require('crypto');

const mkdirp = require('mkdirp');

const findCacheDir = require('find-cache-dir');

const BJSON = require('buffer-json');

const {
  getOptions
} = require('loader-utils');

const validateOptions = require('schema-utils');

const pkg = require('../package.json');

const env = process.env.NODE_ENV || 'development';

const schema = require('./options.json');

const defaults = {
  cacheContext: '',
  cacheDirectory: findCacheDir({
    name: 'cache-loader'
  }) || os.tmpdir(),
  cacheIdentifier: `cache-loader:${pkg.version} ${env}`,
  cacheKey,
  read,
  readOnly: false,
  write
};

function pathWithCacheContext(cacheContext, originalPath) {
  if (!cacheContext) {
    return originalPath;
  }

  if (originalPath.includes(cacheContext)) {
    return originalPath.split('!').map(subPath => path.relative(cacheContext, subPath)).join('!');
  }

  return originalPath.split('!').map(subPath => path.resolve(cacheContext, subPath)).join('!');
}

function loader(...args) {
  const options = Object.assign({}, defaults, getOptions(this));
  validateOptions(schema, options, 'Cache Loader');
  const {
    readOnly,
    write: writeFn
  } = options; // In case we are under a readOnly mode on cache-loader
  // we don't want to write or update any cache file

  if (readOnly) {
    this.callback(null, ...args);
    return;
  }

  const callback = this.async();
  const {
    data
  } = this;
  const dependencies = this.getDependencies().concat(this.loaders.map(l => l.path));
  const contextDependencies = this.getContextDependencies(); // Should the file get cached?

  let cache = true; // this.fs can be undefined
  // e.g when using the thread-loader
  // fallback to the fs module

  const FS = this.fs || fs;

  const toDepDetails = (dep, mapCallback) => {
    FS.stat(dep, (err, stats) => {
      if (err) {
        mapCallback(err);
        return;
      }

      const mtime = stats.mtime.getTime();

      if (mtime / 1000 >= Math.floor(data.startTime / 1000)) {
        // Don't trust mtime.
        // File was changed while compiling
        // or it could be an inaccurate filesystem.
        cache = false;
      }

      mapCallback(null, {
        path: pathWithCacheContext(options.cacheContext, dep),
        mtime
      });
    });
  };

  async.parallel([cb => async.mapLimit(dependencies, 20, toDepDetails, cb), cb => async.mapLimit(contextDependencies, 20, toDepDetails, cb)], (err, taskResults) => {
    if (err) {
      callback(null, ...args);
      return;
    }

    if (!cache) {
      callback(null, ...args);
      return;
    }

    const [deps, contextDeps] = taskResults;
    writeFn(data.cacheKey, {
      remainingRequest: data.remainingRequest,
      dependencies: deps,
      contextDependencies: contextDeps,
      result: args
    }, () => {
      // ignore errors here
      callback(null, ...args);
    });
  });
}

function pitch(remainingRequest, prevRequest, dataInput) {
  const options = Object.assign({}, defaults, getOptions(this));
  validateOptions(schema, options, 'Cache Loader (Pitch)');
  const {
    read: readFn,
    readOnly,
    cacheContext,
    cacheKey: cacheKeyFn
  } = options;
  const callback = this.async();
  const data = dataInput;
  data.remainingRequest = pathWithCacheContext(cacheContext, remainingRequest);
  data.cacheKey = cacheKeyFn(options, data.remainingRequest);
  readFn(data.cacheKey, (readErr, cacheData) => {
    if (readErr) {
      callback();
      return;
    }

    if (cacheData.remainingRequest !== data.remainingRequest) {
      // in case of a hash conflict
      callback();
      return;
    }

    const FS = this.fs || fs;
    async.each(cacheData.dependencies.concat(cacheData.contextDependencies), (dep, eachCallback) => {
      FS.stat(dep.path, (statErr, stats) => {
        if (statErr) {
          eachCallback(statErr);
          return;
        } // When we are under a readOnly config on cache-loader
        // we don't want to emit any other error than a
        // file stat error


        if (readOnly) {
          eachCallback();
          return;
        }

        if (stats.mtime.getTime() !== dep.mtime) {
          eachCallback(true);
          return;
        }

        eachCallback();
      });
    }, err => {
      if (err) {
        data.startTime = Date.now();
        callback();
        return;
      }

      cacheData.dependencies.forEach(dep => this.addDependency(pathWithCacheContext(cacheContext, dep.path)));
      cacheData.contextDependencies.forEach(dep => this.addContextDependency(pathWithCacheContext(cacheContext, dep.path)));
      callback(null, ...cacheData.result);
    });
  });
}

function digest(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

const directories = new Set();

function write(key, data, callback) {
  const dirname = path.dirname(key);
  const content = BJSON.stringify(data);

  if (directories.has(dirname)) {
    // for performance skip creating directory
    fs.writeFile(key, content, 'utf-8', callback);
  } else {
    mkdirp(dirname, mkdirErr => {
      if (mkdirErr) {
        callback(mkdirErr);
        return;
      }

      directories.add(dirname);
      fs.writeFile(key, content, 'utf-8', callback);
    });
  }
}

function read(key, callback) {
  fs.readFile(key, 'utf-8', (err, content) => {
    if (err) {
      callback(err);
      return;
    }

    try {
      const data = BJSON.parse(content);
      callback(null, data);
    } catch (e) {
      callback(e);
    }
  });
}

function cacheKey(options, request) {
  const {
    cacheIdentifier,
    cacheDirectory
  } = options;
  const hash = digest(`${cacheIdentifier}\n${request}`);
  return path.join(cacheDirectory, `${hash}.json`);
}

const raw = true;
exports.raw = raw;