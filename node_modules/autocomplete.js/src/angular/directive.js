'use strict';

var angular = require('angular');

// setup DOM element
var DOM = require('../common/dom.js');
DOM.element = angular.element;

// setup utils functions
var _ = require('../common/utils.js');
_.isArray = angular.isArray;
_.isFunction = angular.isFunction;
_.isObject = angular.isObject;
_.bind = angular.element.proxy;
_.each = angular.forEach;
_.map = angular.element.map;
_.mixin = angular.extend;
_.Event = angular.element.Event;

var EventBus = require('../autocomplete/event_bus.js');
var Typeahead = require('../autocomplete/typeahead.js');

angular.module('algolia.autocomplete', [])
  .directive('autocomplete', ['$parse', '$injector', function($parse, $injector) {
    // inject the sources in the algolia namespace if available
    try {
      $injector.get('algolia').sources = Typeahead.sources;
      $injector.get('algolia').escapeHighlightedString = _.escapeHighlightedString;
    } catch (e) {
      // not fatal
    }

    return {
      restrict: 'AC', // Only apply on an attribute or class
      scope: {
        options: '&aaOptions',
        datasets: '&aaDatasets'
      },
      link: function(scope, element, attrs) {
        if (!element.hasClass('autocomplete') && attrs.autocomplete !== '') return;
        attrs = attrs; // no-unused-vars
        scope.options = $parse(scope.options)(scope);
        if (!scope.options) {
          scope.options = {};
        }
        scope.datasets = $parse(scope.datasets)(scope);
        if (scope.datasets && !angular.isArray(scope.datasets)) {
          scope.datasets = [scope.datasets];
        }

        var eventBus = new EventBus({el: element});
        var autocomplete = null;

        // reinitialization watchers
        scope.$watch('options', initialize);
        if (angular.isArray(scope.datasets)) {
          scope.$watchCollection('datasets', initialize);
        } else {
          scope.$watch('datasets', initialize);
        }

        // init function
        function initialize() {
          if (autocomplete) {
            autocomplete.destroy();
          }
          autocomplete = new Typeahead({
            input: element,
            dropdownMenuContainer: scope.options.dropdownMenuContainer,
            eventBus: eventBus,
            hint: scope.options.hint,
            minLength: scope.options.minLength,
            autoselect: scope.options.autoselect,
            autoselectOnBlur: scope.options.autoselectOnBlur,
            tabAutocomplete: scope.options.tabAutocomplete,
            openOnFocus: scope.options.openOnFocus,
            templates: scope.options.templates,
            debug: scope.options.debug,
            clearOnSelected: scope.options.clearOnSelected,
            cssClasses: scope.options.cssClasses,
            datasets: scope.datasets,
            keyboardShortcuts: scope.options.keyboardShortcuts,
            appendTo: scope.options.appendTo,
            autoWidth: scope.options.autoWidth
          });
        }

        // Propagate the selected event
        element.bind('autocomplete:selected', function(object, suggestion, dataset) {
          scope.$emit('autocomplete:selected', suggestion, dataset);
        });

        // Propagate the autocompleted event
        element.bind('autocomplete:autocompleted', function(object, suggestion, dataset) {
          scope.$emit('autocomplete:autocompleted', suggestion, dataset);
        });

        // Propagate the opened event
        element.bind('autocomplete:opened', function() {
          scope.$emit('autocomplete:opened');
        });

        // Propagate the closed event
        element.bind('autocomplete:closed', function() {
          scope.$emit('autocomplete:closed');
        });

        // Propagate the cursorchanged event
        element.bind('autocomplete:cursorchanged', function(event, suggestion, dataset) {
          scope.$emit('autocomplete:cursorchanged', event, suggestion, dataset);
        });
      }
    };
  }]);
