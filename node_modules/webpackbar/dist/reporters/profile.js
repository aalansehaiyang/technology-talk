'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _cli = require('../utils/cli');

var _profiler = require('../profiler');

var _profiler2 = _interopRequireDefault(_profiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProfileReporter {
  progress(context) {
    if (!context.state.profiler) {
      context.state.profiler = new _profiler2.default();
    }

    context.state.profiler.onRequest(context.state.request);
  }

  done(context) {
    if (context.state.profiler) {
      context.state.profile = context.state.profiler.getFormattedStats();
      delete context.state.profiler;
    }
  }

  allDone(context) {
    let str = '';

    for (const state of context.statesArray) {
      const color = (0, _cli.colorize)(state.color);

      if (state.profile) {
        str += color(`\nProfile results for ${_chalk2.default.bold(state.name)}\n`) + `\n${state.profile}\n`;
        delete state.profile;
      }
    }

    process.stderr.write(str);
  }
}
exports.default = ProfileReporter;