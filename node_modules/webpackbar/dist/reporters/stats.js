'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class StatsReporter {
  constructor(options) {
    this.options = Object.assign({
      chunks: false,
      children: false,
      modules: false,
      colors: true,
      warnings: true,
      errors: true
    }, options);
  }

  done(context, { stats }) {
    const str = stats.toString(this.options);

    if (context.hasErrors) {
      process.stderr.write('\n' + str + '\n');
    } else {
      context.state.statsString = str;
    }
  }

  allDone(context) {
    let str = '';
    for (const state of context.statesArray) {
      if (state.statsString) {
        str += '\n' + state.statsString + '\n';
        delete state.statsString;
      }
    }
    process.stderr.write(str);
  }
}
exports.default = StatsReporter;