'use strict';

/* eslint-env mocha, jasmine */

describe('Typeahead', function() {
  var $ = require('jquery');
  require('jasmine-jquery');

  var fixtures = require('../fixtures.js');
  var $autocomplete = require('../../src/jquery/plugin.js');

  describe('when instantiated from jquery', function() {
    beforeEach(function() {
      this.$fixture = $(setFixtures(fixtures.html.textInput));

      this.view = this.$fixture.find('input').autocomplete({}, [{
        name: 'test',
        source: function(q, cb) {
          cb([{name: 'test'}]);
        },
        templates: {
          suggestion: function(sugg) {
            return sugg.name;
          }
        }
      }]).data('aaAutocomplete');
    });

    it('should initialize', function() {
      expect(this.$fixture.find('.aa-dropdown-menu').length).toEqual(1);
    });

    it('should open the dropdown', function() {
      this.$fixture.find('input').val('test');
      expect(this.view.input.getInputValue()).toEqual('test');
      $autocomplete.call($('input'), 'val', 'test');
      $autocomplete.call($('input'), 'open');
      $autocomplete.call($('input'), 'close');
    });
  });
});
