"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const gray_matter_1 = __importDefault(require("gray-matter"));
const toml_1 = __importDefault(require("toml"));
module.exports = function parseFrontmatter(content) {
    return (0, gray_matter_1.default)(content, {
        // eslint-disable-next-line @typescript-eslint/camelcase
        excerpt_separator: '<!-- more -->',
        engines: {
            toml: toml_1.default.parse.bind(toml_1.default)
        }
    });
};
