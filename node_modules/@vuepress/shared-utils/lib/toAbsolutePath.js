"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const upath_1 = __importDefault(require("upath"));
module.exports = function toAbsolutePath(raw, cwd = process.cwd()) {
    if (upath_1.default.isAbsolute(raw)) {
        return raw;
    }
    return upath_1.default.resolve(cwd, raw);
};
