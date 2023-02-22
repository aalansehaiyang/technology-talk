"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const full_json_1 = __importDefault(require("markdown-it-emoji/lib/data/full.json"));
exports.default = (str) => {
    return String(str).replace(/:(.+?):/g, (placeholder, key) => full_json_1.default[key] || placeholder);
};
