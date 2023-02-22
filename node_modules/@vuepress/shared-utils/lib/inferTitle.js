"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const deeplyParseHeaders_1 = __importDefault(require("./deeplyParseHeaders"));
module.exports = function (frontmatter, strippedContent) {
    if (frontmatter.title) {
        return (0, deeplyParseHeaders_1.default)(frontmatter.title);
    }
    if (frontmatter.home) {
        return 'Home';
    }
    const match = strippedContent.trim().match(/^#+\s+(.*)/);
    if (match) {
        return (0, deeplyParseHeaders_1.default)(match[1]);
    }
};
