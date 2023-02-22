"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.parseStrippedFrontmatter = void 0;
const component_compiler_utils_1 = require("@vue/component-compiler-utils");
const parseFrontmatter_1 = __importDefault(require("./parseFrontmatter"));
function parseStrippedFrontmatter(src) {
    src = `---\n${src}\n---`;
    return (0, parseFrontmatter_1.default)(src);
}
exports.parseStrippedFrontmatter = parseStrippedFrontmatter;
function parse(src) {
    const output = (0, component_compiler_utils_1.parse)({
        source: src,
        compiler: require('vue-template-compiler'),
        needMap: false
    });
    const find = output.customBlocks.find(block => block.type === 'frontmatter');
    const frontmatterRaw = find && find.content;
    if (frontmatterRaw) {
        return parseStrippedFrontmatter(frontmatterRaw);
    }
    return {};
}
exports.parse = parse;
