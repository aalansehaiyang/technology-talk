'use strict';

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine', 'sinon'],

    reporters: ['progress', 'coverage', 'coveralls'],

    browsers: ['PhantomJS'],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        postLoaders: [{
          test: /\.js$/,
          exclude: /(test|node_modules)\//,
          loader: 'istanbul-instrumenter'
        }]
      }
    },

    preprocessors: {
      'test/unit/**/*.js': ['webpack', 'sourcemap']
    },

    webpackMiddleware: {
      noInfo: true
    },

    plugins: [
      'karma-jasmine',
      'karma-sinon',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-opera-launcher',
      'karma-safari-launcher',
      'karma-firefox-launcher',
      'karma-coverage',
      'karma-coveralls',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],

    files: [
      'test/unit/**/*.js'
    ]
  });
};
