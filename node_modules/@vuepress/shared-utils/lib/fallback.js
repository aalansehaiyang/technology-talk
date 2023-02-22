"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsExistsFallback = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
function fsExistsFallback(files) {
    for (const file of files) {
        if (fs_extra_1.default.existsSync(file)) {
            return file;
        }
    }
}
exports.fsExistsFallback = fsExistsFallback;
