"use strict";
module.exports = function ensureLeadingSlash(path) {
    return path.replace(/^\/?/, '/');
};
