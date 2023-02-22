'use strict';

// setup DOM element
var DOM = require('../common/dom.js');
var $ = require('jquery');
DOM.element = $;

// setup utils functions
var _ = require('../common/utils.js');
_.isArray = $.isArray;
_.isFunction = $.isFunction;
_.isObject = $.isPlainObject;
_.bind = $.proxy;
_.each = function(collection, cb) {
  // stupid argument order for jQuery.each
  $.each(collection, reverseArgs);
  function reverseArgs(index, value) {
    return cb(value, index);
  }
};
_.map = $.map;
_.mixin = $.extend;
_.Event = $.Event;

var Typeahead = require('../autocomplete/typeahead.js');
var EventBus = require('../autocomplete/event_bus.js');

var old;
var typeaheadKey;
var methods;

old = $.fn.autocomplete;

typeaheadKey = 'aaAutocomplete';

methods = {
  // supported signatures:
  // function(o, dataset, dataset, ...)
  // function(o, [dataset, dataset, ...])
  initialize: function initialize(o, datasets) {
    datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);

    o = o || {};

    return this.each(attach);

    function attach() {
      var $input = $(this);
      var eventBus = new EventBus({el: $input});
      var typeahead;

      typeahead = new Typeahead({
        input: $input,
        eventBus: eventBus,
        dropdownMenuContainer: o.dropdownMenuContainer,
        hint: o.hint === undefined ? true : !!o.hint,
        minLength: o.minLength,
        autoselect: o.autoselect,
        autoselectOnBlur: o.autoselectOnBlur,
        tabAutocomplete: o.tabAutocomplete,
        openOnFocus: o.openOnFocus,
        templates: o.templates,
        debug: o.debug,
        clearOnSelected: o.clearOnSelected,
        cssClasses: o.cssClasses,
        datasets: datasets,
        keyboardShortcuts: o.keyboardShortcuts,
        appendTo: o.appendTo,
        autoWidth: o.autoWidth
      });

      $input.data(typeaheadKey, typeahead);
    }
  },

  open: function open() {
    return this.each(openTypeahead);

    function openTypeahead() {
      var $input = $(this);
      var typeahead;

      if (typeahead = $input.data(typeaheadKey)) {
        typeahead.open();
      }
    }
  },

  close: function close() {
    return this.each(closeTypeahead);

    function closeTypeahead() {
      var $input = $(this);
      var typeahead;

      if (typeahead = $input.data(typeaheadKey)) {
        typeahead.close();
      }
    }
  },

  val: function val(newVal) {
    // mirror jQuery#val functionality: read operate on first match,
    // write operates on all matches
    return !arguments.length ? getVal(this.first()) : this.each(setVal);

    function setVal() {
      var $input = $(this);
      var typeahead;

      if (typeahead = $input.data(typeaheadKey)) {
        typeahead.setVal(newVal);
      }
    }

    function getVal($input) {
      var typeahead;
      var query;

      if (typeahead = $input.data(typeaheadKey)) {
        query = typeahead.getVal();
      }

      return query;
    }
  },

  destroy: function destroy() {
    return this.each(unattach);

    function unattach() {
      var $input = $(this);
      var typeahead;

      if (typeahead = $input.data(typeaheadKey)) {
        typeahead.destroy();
        $input.removeData(typeaheadKey);
      }
    }
  }
};

$.fn.autocomplete = function(method) {
  var tts;

  // methods that should only act on intialized typeaheads
  if (methods[method] && method !== 'initialize') {
    // filter out non-typeahead inputs
    tts = this.filter(function() { return !!$(this).data(typeaheadKey); });
    return methods[method].apply(tts, [].slice.call(arguments, 1));
  }
  return methods.initialize.apply(this, arguments);
};

$.fn.autocomplete.noConflict = function noConflict() {
  $.fn.autocomplete = old;
  return this;
};

$.fn.autocomplete.sources = Typeahead.sources;
$.fn.autocomplete.escapeHighlightedString = _.escapeHighlightedString;

module.exports = $.fn.autocomplete;
