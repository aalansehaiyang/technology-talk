var path = require('path');
var webpack = require('webpack');

module.exports = {
  output: {
    path: __dirname + "/dist",
    filename: "markdown-it-imsize.js",
    library: "markdown-it-imsize.js",
    libraryTarget: "umd"
  },

  node: {
    fs: 'empty'
  }
};
