"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ensureEndingSlash_1 = __importDefault(require("./ensureEndingSlash"));
const ensureLeadingSlash_1 = __importDefault(require("./ensureLeadingSlash"));
function removeLeadingSlash(path) {
    return path.replace(/^\//, '');
}
function toUtcTime(date) {
    let year = 1970;
    let month = 0;
    let day = 1;
    if (typeof date === 'string') {
        const [yearStr, monthStr, dayStr] = date.split('-');
        year = parseInt(yearStr, 10);
        month = parseInt(monthStr, 10) - 1;
        day = parseInt(dayStr, 10);
    }
    else if (date instanceof Date) {
        // If `date` is an instance of Date,
        // it's because it was parsed from the frontmatter
        // by js-yaml, which always assumes UTC
        return date.getTime();
    }
    return Date.UTC(year, month, day);
}
function addTzOffset(utc) {
    const utcDate = new Date(utc);
    return new Date(utc + utcDate.getTimezoneOffset() * 60 * 1000);
}
module.exports = function getPermalink({ pattern, slug, date, regularPath, localePath = '/' }) {
    if (!pattern) {
        return;
    }
    slug = encodeURI(slug);
    const d = addTzOffset(toUtcTime(date));
    const year = d.getFullYear();
    const iMonth = d.getMonth() + 1;
    const iDay = d.getDate();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    const month = iMonth < 10 ? `0${iMonth}` : iMonth;
    const day = iDay < 10 ? `0${iDay}` : iDay;
    pattern = removeLeadingSlash(pattern);
    const link = localePath
        + pattern
            .replace(/:year/, String(year))
            .replace(/:month/, String(month))
            .replace(/:i_month/, String(iMonth))
            .replace(/:i_day/, String(iDay))
            .replace(/:day/, String(day))
            .replace(/:minutes/, String(minutes))
            .replace(/:seconds/, String(seconds))
            .replace(/:slug/, slug)
            .replace(/:regular/, removeLeadingSlash(regularPath));
    return (0, ensureLeadingSlash_1.default)((0, ensureEndingSlash_1.default)(link));
};
