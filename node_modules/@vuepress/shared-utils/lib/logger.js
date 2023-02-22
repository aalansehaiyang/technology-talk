'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/**
 * Module dependencies.
 */
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor(options) {
        this.options = Object.assign({
            logLevel: process.argv.includes('--debug')
                ? 4
                : 3
        }, options);
    }
    setOptions(options) {
        Object.assign(this.options, options);
    }
    // level: 4
    debug(...args) {
        if (this.options.logLevel < 4) {
            return;
        }
        this.status('magenta', 'debug', ...args);
    }
    // level: 2
    warn(...args) {
        if (this.options.logLevel < 2) {
            return;
        }
        console.warn(chalk_1.default.yellow('warning'), ...args);
    }
    // level: 1
    error(...args) {
        if (this.options.logLevel < 1) {
            return;
        }
        process.exitCode = process.exitCode || 1;
        console.error(chalk_1.default.red('error'), ...args);
    }
    // level: 3
    success(...args) {
        if (this.options.logLevel < 3) {
            return;
        }
        this.status('green', 'success', ...args);
    }
    // level: 3
    tip(...args) {
        if (this.options.logLevel < 3) {
            return;
        }
        this.status('blue', 'tip', ...args);
    }
    // level: 3
    info(...args) {
        if (this.options.logLevel < 3) {
            return;
        }
        this.status('cyan', 'info', ...args);
    }
    wait(...args) {
        if (this.options.logLevel < 3) {
            return;
        }
        this.status('cyan', 'wait', ...args);
    }
    // level: 3
    status(color, label, ...args) {
        if (this.options.logLevel < 3) {
            return;
        }
        console.log(chalk_1.default[color](label), ...args);
    }
    developer(...args) {
        if (process.env.VUEPRESS_ENV !== 'developer' && !process.argv.includes('--developer')) {
            return;
        }
        this.status('cyan', 'developer', ...args);
    }
}
module.exports = new Logger();
