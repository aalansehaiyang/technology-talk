"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const lru_cache_1 = __importDefault(require("lru-cache"));
const deeplyParseHeaders_1 = __importDefault(require("./deeplyParseHeaders"));
/**
 * Extract headers from markdown source content.
 *
 * @param {string} content
 * @param {array} include
 * @param {object} md
 * @returns {array}
 */
const cache = new lru_cache_1.default({ max: 1000 });
module.exports = function (content, include = [], md) {
    const key = content + include.join(',');
    const hit = cache.get(key);
    if (hit) {
        return hit;
    }
    const tokens = md.parse(content, {});
    const res = [];
    tokens.forEach((t, i) => {
        if (t.type === 'heading_open' && include.includes(t.tag)) {
            const title = tokens[i + 1].content;
            const slug = t.attrs.find(([name]) => name === 'id')[1];
            res.push({
                level: parseInt(t.tag.slice(1), 10),
                title: (0, deeplyParseHeaders_1.default)(title),
                slug: slug || md.slugify(title)
            });
        }
    });
    cache.set(key, res);
    return res;
};
