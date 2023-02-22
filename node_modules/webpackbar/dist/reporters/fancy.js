'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _cli = require('../utils/cli');

var _webpack = require('../utils/webpack');

var _consts = require('../utils/consts');

var _logUpdate = require('../utils/log-update');

var _logUpdate2 = _interopRequireDefault(_logUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logUpdate = new _logUpdate2.default(); /* eslint-disable no-console */


let lastRender = Date.now();

class FancyReporter {
  allDone() {
    logUpdate.done();
  }

  done(context) {
    this._renderStates(context.statesArray);

    if (context.hasErrors) {
      logUpdate.done();
    }
  }

  progress(context) {
    if (Date.now() - lastRender > 50) {
      this._renderStates(context.statesArray);
    }
  }

  _renderStates(statesArray) {
    lastRender = Date.now();

    const renderedStates = statesArray.map(c => this._renderState(c)).join('\n\n');

    logUpdate.render('\n' + renderedStates + '\n');
  }

  _renderState(state) {
    const color = (0, _cli.colorize)(state.color);

    let line1;
    let line2;

    if (state.progress >= 0 && state.progress < 100) {
      // Running
      line1 = [color(_consts.BULLET), color(state.name), (0, _cli.renderBar)(state.progress, state.color), state.message, `(${state.progress || 0}%)`, _chalk2.default.grey(state.details[0] || ''), _chalk2.default.grey(state.details[1] || '')].join(' ');

      line2 = state.request ? ' ' + _chalk2.default.grey((0, _cli.ellipsisLeft)((0, _webpack.formatRequest)(state.request), logUpdate.columns)) : '';
    } else {
      let icon = ' ';

      if (state.hasErrors) {
        icon = _consts.CROSS;
      } else if (state.progress === 100) {
        icon = _consts.TICK;
      } else if (state.progress === -1) {
        icon = _consts.CIRCLE_OPEN;
      }

      line1 = color(`${icon} ${state.name}`);
      line2 = _chalk2.default.grey('  ' + state.message);
    }

    return line1 + '\n' + line2;
  }
}
exports.default = FancyReporter;