'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cli = require('../utils/cli');

class SimpleReporter {
  start(context) {
    _cli.consola.info(`Compiling ${context.state.name}`);
  }

  change(context, { shortPath }) {
    _cli.consola.debug(`${shortPath} changed.`, `Rebuilding ${context.state.name}`);
  }

  done(context) {
    const { hasError, message, name } = context.state;
    _cli.consola[hasError ? 'error' : 'success'](`${name}: ${message}`);
  }
}
exports.default = SimpleReporter;