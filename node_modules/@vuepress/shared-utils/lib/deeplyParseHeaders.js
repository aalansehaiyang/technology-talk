"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const compose_1 = __importDefault(require("./compose"));
const parseHeaders_1 = __importDefault(require("./parseHeaders"));
const removeNonCodeWrappedHTML_1 = __importDefault(require("./removeNonCodeWrappedHTML"));
module.exports = (0, compose_1.default)(removeNonCodeWrappedHTML_1.default, parseHeaders_1.default);
