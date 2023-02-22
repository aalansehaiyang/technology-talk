'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatStats;

var _prettyTime = require('pretty-time');

var _prettyTime2 = _interopRequireDefault(_prettyTime);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('../utils');

var _cli = require('../utils/cli');

var _description = require('./description');

var _description2 = _interopRequireDefault(_description);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatStats(allStats) {
  const lines = [];

  Object.keys(allStats).forEach(category => {
    const stats = allStats[category];

    lines.push(`> Stats by ${_chalk2.default.bold((0, _utils.startCase)(category))}`);

    let totalRequests = 0;
    const totalTime = [0, 0];

    const data = [[(0, _utils.startCase)(category), 'Requests', 'Time', 'Time/Request', 'Description']];

    Object.keys(stats).forEach(item => {
      const stat = stats[item];

      totalRequests += stat.count || 0;

      const description = (0, _description2.default)(category, item);

      totalTime[0] += stat.time[0];
      totalTime[1] += stat.time[1];

      const avgTime = [stat.time[0] / stat.count, stat.time[1] / stat.count];

      data.push([item, stat.count || '-', (0, _prettyTime2.default)(stat.time), (0, _prettyTime2.default)(avgTime), description]);
    });

    data.push(['Total', totalRequests, (0, _prettyTime2.default)(totalTime), '', '']);

    lines.push((0, _cli.createTable)(data));
  });

  return `${lines.join('\n\n')}\n`;
}