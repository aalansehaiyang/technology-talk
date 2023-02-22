"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const os_1 = __importDefault(require("os"));
class Performance {
    constructor() {
        this._totalMemory = os_1.default.totalmem();
    }
    start() {
        this._startTime = Date.now();
        this._startFreeMemory = os_1.default.freemem();
    }
    stop() {
        this._endTime = Date.now();
        this._endFreeMemory = os_1.default.freemem();
        return {
            duration: this._endTime - this._startTime,
            memoryDiff: this._endFreeMemory - this._startFreeMemory
        };
    }
}
module.exports = new Performance();
