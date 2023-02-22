"use strict";
module.exports = function removeNonCodeWrappedHTML(str) {
    return String(str).replace(/(^|[^><`\\])<.*>([^><`]|$)/g, '$1$2');
};
