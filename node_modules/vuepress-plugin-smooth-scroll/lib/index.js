"use strict";
const path = require('path');
module.exports = {
    name: 'vuepress-plugin-smooth-scroll',
    enhanceAppFiles: path.resolve(__dirname, 'enhanceApp.js'),
    clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js'),
};
//# sourceMappingURL=index.js.map