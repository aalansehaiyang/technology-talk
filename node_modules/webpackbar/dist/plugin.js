'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _stdEnv = require('std-env');

var _stdEnv2 = _interopRequireDefault(_stdEnv);

var _prettyTime = require('pretty-time');

var _prettyTime2 = _interopRequireDefault(_prettyTime);

var _utils = require('./utils');

var _reporters = require('./reporters');

var reporters = _interopRequireWildcard(_reporters);

var _webpack2 = require('./utils/webpack');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Default plugin options
const DEFAULTS = {
  name: 'webpack',
  color: 'green',
  reporters: _stdEnv2.default.minimalCLI ? ['basic'] : ['fancy'],
  reporter: null
};

// Default state object
// eslint-disable-line import/no-namespace
const DEFAULT_STATE = {
  start: null,
  progress: -1,
  done: false,
  message: '',
  details: [],
  request: null,
  hasErrors: false
};

// Mapping from name => State
const globalStates = {};

class WebpackBarPlugin extends _webpack.ProgressPlugin {
  constructor(options) {
    super();

    this.options = Object.assign({}, DEFAULTS, options);

    // Assign a better handler to base ProgressPlugin
    this.handler = (percent, message, ...details) => {
      this.updateProgress(percent, message, details);
    };

    // Reporters
    this.reporters = Array.from(this.options.reporters || []);
    if (this.options.reporter) {
      this.reporters.push(this.options.reporter);
    }

    // Resolve reposters
    this.reporters = this.reporters.filter(Boolean).map(_reporter => {
      if (this.options[_reporter] === false) {
        return false;
      }

      let reporter = _reporter;
      let reporterOptions = this.options[reporter] || {};

      if (Array.isArray(_reporter)) {
        reporter = _reporter[0]; // eslint-disable-line
        if (_reporter[1] === false) {
          return false;
        }
        if (_reporter[1]) {
          reporterOptions = _reporter[1]; // eslint-disable-line
        }
      }

      if (typeof reporter === 'string') {
        if (reporters[reporter]) {
          reporter = reporters[reporter];
        } else {
          reporter = require(reporter); // eslint-disable-line
        }
      }

      if (typeof reporter === 'function') {
        if (typeof reporter.constructor === 'function') {
          reporter = new reporter(reporterOptions); // eslint-disable-line
        } else {
          reporter = reporter(reporterOptions);
        }
      }

      return reporter;
    }).filter(Boolean);
  }

  callReporters(fn, payload = {}) {
    for (const reporter of this.reporters) {
      if (typeof reporter[fn] === 'function') {
        try {
          reporter[fn](this, payload);
        } catch (e) {
          process.stdout.write(e.stack + '\n');
        }
      }
    }
  }

  get hasRunning() {
    return (0, _utils.objectValues)(this.states).some(state => !state.done);
  }

  get hasErrors() {
    return (0, _utils.objectValues)(this.states).some(state => state.hasErrors);
  }

  get statesArray() {
    return (0, _utils.objectValues)(this.states).sort((s1, s2) => s1.name.localeCompare(s2.name));
  }

  get states() {
    return globalStates;
  }

  get state() {
    return globalStates[this.options.name];
  }

  _ensureState() {
    // Keep our state in shared object
    if (!this.states[this.options.name]) {
      this.states[this.options.name] = Object.assign({}, DEFAULT_STATE, {
        color: this.options.color,
        name: (0, _utils.startCase)(this.options.name)
      });
    }
  }

  apply(compiler) {
    // Prevent adding multi instances to the same compiler
    if (compiler.webpackbar) {
      return;
    }
    compiler.webpackbar = this;

    // Apply base hooks
    super.apply(compiler);

    // Register our state after all plugins initialized
    (0, _webpack2.hook)(compiler, 'afterPlugins', () => {
      this._ensureState();
    });

    // Hook into the compiler before a new compilation is created.
    (0, _webpack2.hook)(compiler, 'compile', () => {
      this._ensureState();

      Object.assign(this.state, Object.assign({}, DEFAULT_STATE, {
        start: process.hrtime()
      }));

      this.callReporters('start');
    });

    // Watch compilation has been invalidated.
    (0, _webpack2.hook)(compiler, 'invalid', (fileName, changeTime) => {
      this._ensureState();

      this.callReporters('change', {
        path: fileName,
        shortPath: (0, _utils.shortenPath)(fileName),
        time: changeTime
      });
    });

    // Compilation has completed
    (0, _webpack2.hook)(compiler, 'done', stats => {
      this._ensureState();

      // Prevent calling done twice
      if (this.state.done) {
        return;
      }

      const hasErrors = stats.hasErrors();
      const status = hasErrors ? 'with some errors' : 'successfully';

      const time = this.state.start ? ' in ' + (0, _prettyTime2.default)(process.hrtime(this.state.start), 2) : '';

      Object.assign(this.state, Object.assign({}, DEFAULT_STATE, {
        progress: 100,
        done: true,
        message: `Compiled ${status}${time}`,
        hasErrors
      }));

      this.callReporters('progress');

      this.callReporters('done', { stats });

      if (!this.hasRunning) {
        this.callReporters('beforeAllDone');
        this.callReporters('allDone');
        this.callReporters('afterAllDone');
      }
    });
  }

  updateProgress(percent = 0, message = '', details = []) {
    const progress = Math.floor(percent * 100);

    Object.assign(this.state, {
      progress,
      message: message || '',
      details,
      request: (0, _webpack2.parseRequest)(details[2])
    });

    this.callReporters('progress');
  }
}
exports.default = WebpackBarPlugin;