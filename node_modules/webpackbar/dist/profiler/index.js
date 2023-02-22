'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _format = require('./format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Profiler {
  constructor() {
    this.requests = [];
  }

  onRequest(request) {
    if (!request) {
      return;
    }

    // Measure time for last request
    if (this.requests.length) {
      const lastReq = this.requests[this.requests.length - 1];
      if (lastReq.start) {
        lastReq.time = process.hrtime(lastReq.start);
        delete lastReq.start;
      }
    }

    // Ignore requests without any file or loaders
    if (!request.file || !request.loaders.length) {
      return;
    }

    this.requests.push({
      request,
      start: process.hrtime()
    });
  }

  getStats() {
    const loaderStats = {};
    const extStats = {};

    const getStat = (stats, name) => {
      if (!stats[name]) {
        // eslint-disable-next-line no-param-reassign
        stats[name] = {
          count: 0,
          time: [0, 0]
        };
      }
      return stats[name];
    };

    const addToStat = (stats, name, count, time) => {
      const stat = getStat(stats, name);
      stat.count += count;
      stat.time[0] += time[0];
      stat.time[1] += time[1];
    };

    this.requests.forEach(({ request, time = [0, 0] }) => {
      request.loaders.forEach(loader => {
        addToStat(loaderStats, loader, 1, time);
      });

      const ext = request.file && _path2.default.extname(request.file).substr(1);
      addToStat(extStats, ext && ext.length ? ext : 'unknown', 1, time);
    });

    return {
      ext: extStats,
      loader: loaderStats
    };
  }

  getFormattedStats() {
    return (0, _format2.default)(this.getStats());
  }
}
exports.default = Profiler;