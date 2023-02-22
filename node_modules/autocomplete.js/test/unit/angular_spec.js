'use strict';

/* eslint-env mocha, jasmine */

if (typeof Function.prototype.bind != 'function') {
  Function.prototype.bind = function bind(obj) {
    var args = Array.prototype.slice.call(arguments, 1),
      self = this,
      nop = function() {
      },
      bound = function() {
        return self.apply(
          this instanceof nop ? this : (obj || {}), args.concat(
            Array.prototype.slice.call(arguments)
          )
        );
      };
    nop.prototype = this.prototype || {};
    bound.prototype = new nop();
    return bound;
  };
}

describe('autocomplete directive', function() {
  global.jQuery = require('jquery');
  var fixtures = require('../fixtures.js');

  var angular = require('angular');
  require('../../src/angular/directive.js');
  require('angular-mocks');

  var scope;

  beforeEach(angular.mock.module('algolia.autocomplete'));

  describe('with scope', function() {
    beforeEach(angular.mock.inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      scope.q = '';
      scope.getDatasets = function() {
        return [];
      };
    }));

    describe('when initialized', function() {
      var form;

      beforeEach(function() {
        inject(function($compile) {
          form = $compile(fixtures.html.angularTextInput)(scope);
        });
        scope.$digest();
      });

      it('should have a parent', function() {
        expect(form.parent().length).toEqual(1);
      });
    });
  });

  afterAll(function() {
    global.jQuery = undefined;
  });
});
