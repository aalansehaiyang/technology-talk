'use strict';

var assert = require('assert');
var path = require('path');
var generate = require('markdown-it-testgen');
var should = require('should');

describe('markdown-it-imsize', function() {
  var md = require('markdown-it')({
    html: true,
    linkify: true,
    typography: true
  }).use(require('../lib'));
  generate(path.join(__dirname, 'fixtures/markdown-it-imsize/imsize.txt'), md);
});

describe('markdown-it-imsize (autofill)', function() {
  var md = require('markdown-it')({
    html: true,
    linkify: true,
    typography: true
  }).use(require('../lib'), { autofill: true });
  generate(path.join(__dirname, 'fixtures/markdown-it-imsize/autofill.txt'), md);
});

describe('image size detector', function() {
  var imsize = require('../lib/imsize');
  var types = require('../lib/imsize/types');

  it('image size detector', function(done) {
    types.forEach(function(type) {
      var dim = imsize('./test/img/lena.' + type);
      assert.equal(dim.width, 128);
      assert.equal(dim.height, 128);
    });
    done();
  });

  it('imsize detector anync', function() {
    types.forEach(function(type) {
      imsize('./test/img/lena.' + type, function(err, dim) {
        assert.equal(dim.width, 128);
        assert.equal(dim.height, 128);
      });
    });
  });

  it('invalid operation', function(done) {
    (function() { imsize('./test/img/lena.svg') }).should.throw();
    done();
  });
});
