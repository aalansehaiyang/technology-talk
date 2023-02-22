/*!
 * autocomplete.js 0.36.0
 * https://github.com/algolia/autocomplete.js
 * Copyright 2019 Algolia, Inc. and other contributors; Licensed MIT
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(2);

	// setup DOM element
	var DOM = __webpack_require__(3);
	DOM.element = angular.element;

	// setup utils functions
	var _ = __webpack_require__(4);
	_.isArray = angular.isArray;
	_.isFunction = angular.isFunction;
	_.isObject = angular.isObject;
	_.bind = angular.element.proxy;
	_.each = angular.forEach;
	_.map = angular.element.map;
	_.mixin = angular.extend;
	_.Event = angular.element.Event;

	var EventBus = __webpack_require__(5);
	var Typeahead = __webpack_require__(6);

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  element: null
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DOM = __webpack_require__(3);

	function escapeRegExp(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	}

	module.exports = {
	  // those methods are implemented differently
	  // depending on which build it is, using
	  // $... or angular... or Zepto... or require(...)
	  isArray: null,
	  isFunction: null,
	  isObject: null,
	  bind: null,
	  each: null,
	  map: null,
	  mixin: null,

	  isMsie: function(agentString) {
	    if (agentString === undefined) { agentString = navigator.userAgent; }
	    // from https://github.com/ded/bowser/blob/master/bowser.js
	    if ((/(msie|trident)/i).test(agentString)) {
	      var match = agentString.match(/(msie |rv:)(\d+(.\d+)?)/i);
	      if (match) { return match[2]; }
	    }
	    return false;
	  },

	  // http://stackoverflow.com/a/6969486
	  escapeRegExChars: function(str) {
	    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	  },

	  isNumber: function(obj) { return typeof obj === 'number'; },

	  toStr: function toStr(s) {
	    return s === undefined || s === null ? '' : s + '';
	  },

	  cloneDeep: function cloneDeep(obj) {
	    var clone = this.mixin({}, obj);
	    var self = this;
	    this.each(clone, function(value, key) {
	      if (value) {
	        if (self.isArray(value)) {
	          clone[key] = [].concat(value);
	        } else if (self.isObject(value)) {
	          clone[key] = self.cloneDeep(value);
	        }
	      }
	    });
	    return clone;
	  },

	  error: function(msg) {
	    throw new Error(msg);
	  },

	  every: function(obj, test) {
	    var result = true;
	    if (!obj) {
	      return result;
	    }
	    this.each(obj, function(val, key) {
	      if (result) {
	        result = test.call(null, val, key, obj) && result;
	      }
	    });
	    return !!result;
	  },

	  any: function(obj, test) {
	    var found = false;
	    if (!obj) {
	      return found;
	    }
	    this.each(obj, function(val, key) {
	      if (test.call(null, val, key, obj)) {
	        found = true;
	        return false;
	      }
	    });
	    return found;
	  },

	  getUniqueId: (function() {
	    var counter = 0;
	    return function() { return counter++; };
	  })(),

	  templatify: function templatify(obj) {
	    if (this.isFunction(obj)) {
	      return obj;
	    }
	    var $template = DOM.element(obj);
	    if ($template.prop('tagName') === 'SCRIPT') {
	      return function template() { return $template.text(); };
	    }
	    return function template() { return String(obj); };
	  },

	  defer: function(fn) { setTimeout(fn, 0); },

	  noop: function() {},

	  formatPrefix: function(prefix, noPrefix) {
	    return noPrefix ? '' : prefix + '-';
	  },

	  className: function(prefix, clazz, skipDot) {
	    return (skipDot ? '' : '.') + prefix + clazz;
	  },

	  escapeHighlightedString: function(str, highlightPreTag, highlightPostTag) {
	    highlightPreTag = highlightPreTag || '<em>';
	    var pre = document.createElement('div');
	    pre.appendChild(document.createTextNode(highlightPreTag));

	    highlightPostTag = highlightPostTag || '</em>';
	    var post = document.createElement('div');
	    post.appendChild(document.createTextNode(highlightPostTag));

	    var div = document.createElement('div');
	    div.appendChild(document.createTextNode(str));
	    return div.innerHTML
	      .replace(RegExp(escapeRegExp(pre.innerHTML), 'g'), highlightPreTag)
	      .replace(RegExp(escapeRegExp(post.innerHTML), 'g'), highlightPostTag);
	  }
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var namespace = 'autocomplete:';

	var _ = __webpack_require__(4);
	var DOM = __webpack_require__(3);

	// constructor
	// -----------

	function EventBus(o) {
	  if (!o || !o.el) {
	    _.error('EventBus initialized without el');
	  }

	  this.$el = DOM.element(o.el);
	}

	// instance methods
	// ----------------

	_.mixin(EventBus.prototype, {

	  // ### public

	  trigger: function(type, suggestion, dataset, context) {
	    var event = _.Event(namespace + type);
	    this.$el.trigger(event, [suggestion, dataset, context]);
	    return event;
	  }
	});

	module.exports = EventBus;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var attrsKey = 'aaAttrs';

	var _ = __webpack_require__(4);
	var DOM = __webpack_require__(3);
	var EventBus = __webpack_require__(5);
	var Input = __webpack_require__(7);
	var Dropdown = __webpack_require__(16);
	var html = __webpack_require__(18);
	var css = __webpack_require__(19);

	// constructor
	// -----------

	// THOUGHT: what if datasets could dynamically be added/removed?
	function Typeahead(o) {
	  var $menu;
	  var $hint;

	  o = o || {};

	  if (!o.input) {
	    _.error('missing input');
	  }

	  this.isActivated = false;
	  this.debug = !!o.debug;
	  this.autoselect = !!o.autoselect;
	  this.autoselectOnBlur = !!o.autoselectOnBlur;
	  this.openOnFocus = !!o.openOnFocus;
	  this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
	  this.autoWidth = (o.autoWidth === undefined) ? true : !!o.autoWidth;
	  this.clearOnSelected = !!o.clearOnSelected;
	  this.tabAutocomplete = (o.tabAutocomplete === undefined) ? true : !!o.tabAutocomplete;

	  o.hint = !!o.hint;

	  if (o.hint && o.appendTo) {
	    throw new Error('[autocomplete.js] hint and appendTo options can\'t be used at the same time');
	  }

	  this.css = o.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
	  this.cssClasses = o.cssClasses = _.mixin({}, css.defaultClasses, o.cssClasses || {});
	  this.cssClasses.prefix =
	    o.cssClasses.formattedPrefix = _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);
	  this.listboxId = o.listboxId = [this.cssClasses.root, 'listbox', _.getUniqueId()].join('-');

	  var domElts = buildDom(o);

	  this.$node = domElts.wrapper;
	  var $input = this.$input = domElts.input;
	  $menu = domElts.menu;
	  $hint = domElts.hint;

	  if (o.dropdownMenuContainer) {
	    DOM.element(o.dropdownMenuContainer)
	      .css('position', 'relative') // ensure the container has a relative position
	      .append($menu.css('top', '0')); // override the top: 100%
	  }

	  // #705: if there's scrollable overflow, ie doesn't support
	  // blur cancellations when the scrollbar is clicked
	  //
	  // #351: preventDefault won't cancel blurs in ie <= 8
	  $input.on('blur.aa', function($e) {
	    var active = document.activeElement;
	    if (_.isMsie() && ($menu[0] === active || $menu[0].contains(active))) {
	      $e.preventDefault();
	      // stop immediate in order to prevent Input#_onBlur from
	      // getting exectued
	      $e.stopImmediatePropagation();
	      _.defer(function() { $input.focus(); });
	    }
	  });

	  // #351: prevents input blur due to clicks within dropdown menu
	  $menu.on('mousedown.aa', function($e) { $e.preventDefault(); });

	  this.eventBus = o.eventBus || new EventBus({el: $input});

	  this.dropdown = new Typeahead.Dropdown({
	    appendTo: o.appendTo,
	    wrapper: this.$node,
	    menu: $menu,
	    datasets: o.datasets,
	    templates: o.templates,
	    cssClasses: o.cssClasses,
	    minLength: this.minLength
	  })
	    .onSync('suggestionClicked', this._onSuggestionClicked, this)
	    .onSync('cursorMoved', this._onCursorMoved, this)
	    .onSync('cursorRemoved', this._onCursorRemoved, this)
	    .onSync('opened', this._onOpened, this)
	    .onSync('closed', this._onClosed, this)
	    .onSync('shown', this._onShown, this)
	    .onSync('empty', this._onEmpty, this)
	    .onSync('redrawn', this._onRedrawn, this)
	    .onAsync('datasetRendered', this._onDatasetRendered, this);

	  this.input = new Typeahead.Input({input: $input, hint: $hint})
	    .onSync('focused', this._onFocused, this)
	    .onSync('blurred', this._onBlurred, this)
	    .onSync('enterKeyed', this._onEnterKeyed, this)
	    .onSync('tabKeyed', this._onTabKeyed, this)
	    .onSync('escKeyed', this._onEscKeyed, this)
	    .onSync('upKeyed', this._onUpKeyed, this)
	    .onSync('downKeyed', this._onDownKeyed, this)
	    .onSync('leftKeyed', this._onLeftKeyed, this)
	    .onSync('rightKeyed', this._onRightKeyed, this)
	    .onSync('queryChanged', this._onQueryChanged, this)
	    .onSync('whitespaceChanged', this._onWhitespaceChanged, this);

	  this._bindKeyboardShortcuts(o);

	  this._setLanguageDirection();
	}

	// instance methods
	// ----------------

	_.mixin(Typeahead.prototype, {
	  // ### private

	  _bindKeyboardShortcuts: function(options) {
	    if (!options.keyboardShortcuts) {
	      return;
	    }
	    var $input = this.$input;
	    var keyboardShortcuts = [];
	    _.each(options.keyboardShortcuts, function(key) {
	      if (typeof key === 'string') {
	        key = key.toUpperCase().charCodeAt(0);
	      }
	      keyboardShortcuts.push(key);
	    });
	    DOM.element(document).keydown(function(event) {
	      var elt = (event.target || event.srcElement);
	      var tagName = elt.tagName;
	      if (elt.isContentEditable || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') {
	        // already in an input
	        return;
	      }

	      var which = event.which || event.keyCode;
	      if (keyboardShortcuts.indexOf(which) === -1) {
	        // not the right shortcut
	        return;
	      }

	      $input.focus();
	      event.stopPropagation();
	      event.preventDefault();
	    });
	  },

	  _onSuggestionClicked: function onSuggestionClicked(type, $el) {
	    var datum;
	    var context = {selectionMethod: 'click'};

	    if (datum = this.dropdown.getDatumForSuggestion($el)) {
	      this._select(datum, context);
	    }
	  },

	  _onCursorMoved: function onCursorMoved(event, updateInput) {
	    var datum = this.dropdown.getDatumForCursor();
	    var currentCursorId = this.dropdown.getCurrentCursor().attr('id');
	    this.input.setActiveDescendant(currentCursorId);

	    if (datum) {
	      if (updateInput) {
	        this.input.setInputValue(datum.value, true);
	      }

	      this.eventBus.trigger('cursorchanged', datum.raw, datum.datasetName);
	    }
	  },

	  _onCursorRemoved: function onCursorRemoved() {
	    this.input.resetInputValue();
	    this._updateHint();
	    this.eventBus.trigger('cursorremoved');
	  },

	  _onDatasetRendered: function onDatasetRendered() {
	    this._updateHint();

	    this.eventBus.trigger('updated');
	  },

	  _onOpened: function onOpened() {
	    this._updateHint();
	    this.input.expand();

	    this.eventBus.trigger('opened');
	  },

	  _onEmpty: function onEmpty() {
	    this.eventBus.trigger('empty');
	  },

	  _onRedrawn: function onRedrawn() {
	    this.$node.css('top', 0 + 'px');
	    this.$node.css('left', 0 + 'px');

	    var inputRect = this.$input[0].getBoundingClientRect();

	    if (this.autoWidth) {
	      this.$node.css('width', inputRect.width + 'px');
	    }

	    var wrapperRect = this.$node[0].getBoundingClientRect();

	    var top = inputRect.bottom - wrapperRect.top;
	    this.$node.css('top', top + 'px');
	    var left = inputRect.left - wrapperRect.left;
	    this.$node.css('left', left + 'px');

	    this.eventBus.trigger('redrawn');
	  },

	  _onShown: function onShown() {
	    this.eventBus.trigger('shown');
	    if (this.autoselect) {
	      this.dropdown.cursorTopSuggestion();
	    }
	  },

	  _onClosed: function onClosed() {
	    this.input.clearHint();
	    this.input.removeActiveDescendant();
	    this.input.collapse();

	    this.eventBus.trigger('closed');
	  },

	  _onFocused: function onFocused() {
	    this.isActivated = true;

	    if (this.openOnFocus) {
	      var query = this.input.getQuery();
	      if (query.length >= this.minLength) {
	        this.dropdown.update(query);
	      } else {
	        this.dropdown.empty();
	      }

	      this.dropdown.open();
	    }
	  },

	  _onBlurred: function onBlurred() {
	    var cursorDatum;
	    var topSuggestionDatum;

	    cursorDatum = this.dropdown.getDatumForCursor();
	    topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
	    var context = {selectionMethod: 'blur'};

	    if (!this.debug) {
	      if (this.autoselectOnBlur && cursorDatum) {
	        this._select(cursorDatum, context);
	      } else if (this.autoselectOnBlur && topSuggestionDatum) {
	        this._select(topSuggestionDatum, context);
	      } else {
	        this.isActivated = false;
	        this.dropdown.empty();
	        this.dropdown.close();
	      }
	    }
	  },

	  _onEnterKeyed: function onEnterKeyed(type, $e) {
	    var cursorDatum;
	    var topSuggestionDatum;

	    cursorDatum = this.dropdown.getDatumForCursor();
	    topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
	    var context = {selectionMethod: 'enterKey'};

	    if (cursorDatum) {
	      this._select(cursorDatum, context);
	      $e.preventDefault();
	    } else if (this.autoselect && topSuggestionDatum) {
	      this._select(topSuggestionDatum, context);
	      $e.preventDefault();
	    }
	  },

	  _onTabKeyed: function onTabKeyed(type, $e) {
	    if (!this.tabAutocomplete) {
	      // Closing the dropdown enables further tabbing
	      this.dropdown.close();
	      return;
	    }

	    var datum;
	    var context = {selectionMethod: 'tabKey'};

	    if (datum = this.dropdown.getDatumForCursor()) {
	      this._select(datum, context);
	      $e.preventDefault();
	    } else {
	      this._autocomplete(true);
	    }
	  },

	  _onEscKeyed: function onEscKeyed() {
	    this.dropdown.close();
	    this.input.resetInputValue();
	  },

	  _onUpKeyed: function onUpKeyed() {
	    var query = this.input.getQuery();

	    if (this.dropdown.isEmpty && query.length >= this.minLength) {
	      this.dropdown.update(query);
	    } else {
	      this.dropdown.moveCursorUp();
	    }

	    this.dropdown.open();
	  },

	  _onDownKeyed: function onDownKeyed() {
	    var query = this.input.getQuery();

	    if (this.dropdown.isEmpty && query.length >= this.minLength) {
	      this.dropdown.update(query);
	    } else {
	      this.dropdown.moveCursorDown();
	    }

	    this.dropdown.open();
	  },

	  _onLeftKeyed: function onLeftKeyed() {
	    if (this.dir === 'rtl') {
	      this._autocomplete();
	    }
	  },

	  _onRightKeyed: function onRightKeyed() {
	    if (this.dir === 'ltr') {
	      this._autocomplete();
	    }
	  },

	  _onQueryChanged: function onQueryChanged(e, query) {
	    this.input.clearHintIfInvalid();

	    if (query.length >= this.minLength) {
	      this.dropdown.update(query);
	    } else {
	      this.dropdown.empty();
	    }

	    this.dropdown.open();
	    this._setLanguageDirection();
	  },

	  _onWhitespaceChanged: function onWhitespaceChanged() {
	    this._updateHint();
	    this.dropdown.open();
	  },

	  _setLanguageDirection: function setLanguageDirection() {
	    var dir = this.input.getLanguageDirection();

	    if (this.dir !== dir) {
	      this.dir = dir;
	      this.$node.css('direction', dir);
	      this.dropdown.setLanguageDirection(dir);
	    }
	  },

	  _updateHint: function updateHint() {
	    var datum;
	    var val;
	    var query;
	    var escapedQuery;
	    var frontMatchRegEx;
	    var match;

	    datum = this.dropdown.getDatumForTopSuggestion();

	    if (datum && this.dropdown.isVisible() && !this.input.hasOverflow()) {
	      val = this.input.getInputValue();
	      query = Input.normalizeQuery(val);
	      escapedQuery = _.escapeRegExChars(query);

	      // match input value, then capture trailing text
	      frontMatchRegEx = new RegExp('^(?:' + escapedQuery + ')(.+$)', 'i');
	      match = frontMatchRegEx.exec(datum.value);

	      // clear hint if there's no trailing text
	      if (match) {
	        this.input.setHint(val + match[1]);
	      } else {
	        this.input.clearHint();
	      }
	    } else {
	      this.input.clearHint();
	    }
	  },

	  _autocomplete: function autocomplete(laxCursor) {
	    var hint;
	    var query;
	    var isCursorAtEnd;
	    var datum;

	    hint = this.input.getHint();
	    query = this.input.getQuery();
	    isCursorAtEnd = laxCursor || this.input.isCursorAtEnd();

	    if (hint && query !== hint && isCursorAtEnd) {
	      datum = this.dropdown.getDatumForTopSuggestion();
	      if (datum) {
	        this.input.setInputValue(datum.value);
	      }

	      this.eventBus.trigger('autocompleted', datum.raw, datum.datasetName);
	    }
	  },

	  _select: function select(datum, context) {
	    if (typeof datum.value !== 'undefined') {
	      this.input.setQuery(datum.value);
	    }
	    if (this.clearOnSelected) {
	      this.setVal('');
	    } else {
	      this.input.setInputValue(datum.value, true);
	    }

	    this._setLanguageDirection();

	    var event = this.eventBus.trigger('selected', datum.raw, datum.datasetName, context);
	    if (event.isDefaultPrevented() === false) {
	      this.dropdown.close();

	      // #118: allow click event to bubble up to the body before removing
	      // the suggestions otherwise we break event delegation
	      _.defer(_.bind(this.dropdown.empty, this.dropdown));
	    }
	  },

	  // ### public

	  open: function open() {
	    // if the menu is not activated yet, we need to update
	    // the underlying dropdown menu to trigger the search
	    // otherwise we're not gonna see anything
	    if (!this.isActivated) {
	      var query = this.input.getInputValue();
	      if (query.length >= this.minLength) {
	        this.dropdown.update(query);
	      } else {
	        this.dropdown.empty();
	      }
	    }
	    this.dropdown.open();
	  },

	  close: function close() {
	    this.dropdown.close();
	  },

	  setVal: function setVal(val) {
	    // expect val to be a string, so be safe, and coerce
	    val = _.toStr(val);

	    if (this.isActivated) {
	      this.input.setInputValue(val);
	    } else {
	      this.input.setQuery(val);
	      this.input.setInputValue(val, true);
	    }

	    this._setLanguageDirection();
	  },

	  getVal: function getVal() {
	    return this.input.getQuery();
	  },

	  destroy: function destroy() {
	    this.input.destroy();
	    this.dropdown.destroy();

	    destroyDomStructure(this.$node, this.cssClasses);

	    this.$node = null;
	  },

	  getWrapper: function getWrapper() {
	    return this.dropdown.$container[0];
	  }
	});

	function buildDom(options) {
	  var $input;
	  var $wrapper;
	  var $dropdown;
	  var $hint;

	  $input = DOM.element(options.input);
	  $wrapper = DOM
	    .element(html.wrapper.replace('%ROOT%', options.cssClasses.root))
	    .css(options.css.wrapper);

	  // override the display property with the table-cell value
	  // if the parent element is a table and the original input was a block
	  //  -> https://github.com/algolia/autocomplete.js/issues/16
	  if (!options.appendTo && $input.css('display') === 'block' && $input.parent().css('display') === 'table') {
	    $wrapper.css('display', 'table-cell');
	  }
	  var dropdownHtml = html.dropdown.
	    replace('%PREFIX%', options.cssClasses.prefix).
	    replace('%DROPDOWN_MENU%', options.cssClasses.dropdownMenu);
	  $dropdown = DOM.element(dropdownHtml)
	    .css(options.css.dropdown)
	    .attr({
	      role: 'listbox',
	      id: options.listboxId
	    });
	  if (options.templates && options.templates.dropdownMenu) {
	    $dropdown.html(_.templatify(options.templates.dropdownMenu)());
	  }
	  $hint = $input.clone().css(options.css.hint).css(getBackgroundStyles($input));

	  $hint
	    .val('')
	    .addClass(_.className(options.cssClasses.prefix, options.cssClasses.hint, true))
	    .removeAttr('id name placeholder required')
	    .prop('readonly', true)
	    .attr({
	      'aria-hidden': 'true',
	      autocomplete: 'off',
	      spellcheck: 'false',
	      tabindex: -1
	    });
	  if ($hint.removeData) {
	    $hint.removeData();
	  }

	  // store the original values of the attrs that get modified
	  // so modifications can be reverted on destroy
	  $input.data(attrsKey, {
	    'aria-autocomplete': $input.attr('aria-autocomplete'),
	    'aria-expanded': $input.attr('aria-expanded'),
	    'aria-owns': $input.attr('aria-owns'),
	    autocomplete: $input.attr('autocomplete'),
	    dir: $input.attr('dir'),
	    role: $input.attr('role'),
	    spellcheck: $input.attr('spellcheck'),
	    style: $input.attr('style'),
	    type: $input.attr('type')
	  });

	  $input
	    .addClass(_.className(options.cssClasses.prefix, options.cssClasses.input, true))
	    .attr({
	      autocomplete: 'off',
	      spellcheck: false,

	      // Accessibility features
	      // Give the field a presentation of a "select".
	      // Combobox is the combined presentation of a single line textfield
	      // with a listbox popup.
	      // https://www.w3.org/WAI/PF/aria/roles#combobox
	      role: 'combobox',
	      // Let the screen reader know the field has an autocomplete
	      // feature to it.
	      'aria-autocomplete': (options.datasets &&
	        options.datasets[0] && options.datasets[0].displayKey ? 'both' : 'list'),
	      // Indicates whether the dropdown it controls is currently expanded or collapsed
	      'aria-expanded': 'false',
	      'aria-label': options.ariaLabel,
	      // Explicitly point to the listbox,
	      // which is a list of suggestions (aka options)
	      'aria-owns': options.listboxId
	    })
	    .css(options.hint ? options.css.input : options.css.inputWithNoHint);

	  // ie7 does not like it when dir is set to auto
	  try {
	    if (!$input.attr('dir')) {
	      $input.attr('dir', 'auto');
	    }
	  } catch (e) {
	    // ignore
	  }

	  $wrapper = options.appendTo
	    ? $wrapper.appendTo(DOM.element(options.appendTo).eq(0)).eq(0)
	    : $input.wrap($wrapper).parent();

	  $wrapper
	    .prepend(options.hint ? $hint : null)
	    .append($dropdown);

	  return {
	    wrapper: $wrapper,
	    input: $input,
	    hint: $hint,
	    menu: $dropdown
	  };
	}

	function getBackgroundStyles($el) {
	  return {
	    backgroundAttachment: $el.css('background-attachment'),
	    backgroundClip: $el.css('background-clip'),
	    backgroundColor: $el.css('background-color'),
	    backgroundImage: $el.css('background-image'),
	    backgroundOrigin: $el.css('background-origin'),
	    backgroundPosition: $el.css('background-position'),
	    backgroundRepeat: $el.css('background-repeat'),
	    backgroundSize: $el.css('background-size')
	  };
	}

	function destroyDomStructure($node, cssClasses) {
	  var $input = $node.find(_.className(cssClasses.prefix, cssClasses.input));

	  // need to remove attrs that weren't previously defined and
	  // revert attrs that originally had a value
	  _.each($input.data(attrsKey), function(val, key) {
	    if (val === undefined) {
	      $input.removeAttr(key);
	    } else {
	      $input.attr(key, val);
	    }
	  });

	  $input
	    .detach()
	    .removeClass(_.className(cssClasses.prefix, cssClasses.input, true))
	    .insertAfter($node);
	  if ($input.removeData) {
	    $input.removeData(attrsKey);
	  }

	  $node.remove();
	}

	Typeahead.Dropdown = Dropdown;
	Typeahead.Input = Input;
	Typeahead.sources = __webpack_require__(20);

	module.exports = Typeahead;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var specialKeyCodeMap;

	specialKeyCodeMap = {
	  9: 'tab',
	  27: 'esc',
	  37: 'left',
	  39: 'right',
	  13: 'enter',
	  38: 'up',
	  40: 'down'
	};

	var _ = __webpack_require__(4);
	var DOM = __webpack_require__(3);
	var EventEmitter = __webpack_require__(8);

	// constructor
	// -----------

	function Input(o) {
	  var that = this;
	  var onBlur;
	  var onFocus;
	  var onKeydown;
	  var onInput;

	  o = o || {};

	  if (!o.input) {
	    _.error('input is missing');
	  }

	  // bound functions
	  onBlur = _.bind(this._onBlur, this);
	  onFocus = _.bind(this._onFocus, this);
	  onKeydown = _.bind(this._onKeydown, this);
	  onInput = _.bind(this._onInput, this);

	  this.$hint = DOM.element(o.hint);
	  this.$input = DOM.element(o.input)
	    .on('blur.aa', onBlur)
	    .on('focus.aa', onFocus)
	    .on('keydown.aa', onKeydown);

	  // if no hint, noop all the hint related functions
	  if (this.$hint.length === 0) {
	    this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
	  }

	  // ie7 and ie8 don't support the input event
	  // ie9 doesn't fire the input event when characters are removed
	  // not sure if ie10 is compatible
	  if (!_.isMsie()) {
	    this.$input.on('input.aa', onInput);
	  } else {
	    this.$input.on('keydown.aa keypress.aa cut.aa paste.aa', function($e) {
	      // if a special key triggered this, ignore it
	      if (specialKeyCodeMap[$e.which || $e.keyCode]) {
	        return;
	      }

	      // give the browser a chance to update the value of the input
	      // before checking to see if the query changed
	      _.defer(_.bind(that._onInput, that, $e));
	    });
	  }

	  // the query defaults to whatever the value of the input is
	  // on initialization, it'll most likely be an empty string
	  this.query = this.$input.val();

	  // helps with calculating the width of the input's value
	  this.$overflowHelper = buildOverflowHelper(this.$input);
	}

	// static methods
	// --------------

	Input.normalizeQuery = function(str) {
	  // strips leading whitespace and condenses all whitespace
	  return (str || '').replace(/^\s*/g, '').replace(/\s{2,}/g, ' ');
	};

	// instance methods
	// ----------------

	_.mixin(Input.prototype, EventEmitter, {

	  // ### private

	  _onBlur: function onBlur() {
	    this.resetInputValue();
	    this.$input.removeAttr('aria-activedescendant');
	    this.trigger('blurred');
	  },

	  _onFocus: function onFocus() {
	    this.trigger('focused');
	  },

	  _onKeydown: function onKeydown($e) {
	    // which is normalized and consistent (but not for ie)
	    var keyName = specialKeyCodeMap[$e.which || $e.keyCode];

	    this._managePreventDefault(keyName, $e);
	    if (keyName && this._shouldTrigger(keyName, $e)) {
	      this.trigger(keyName + 'Keyed', $e);
	    }
	  },

	  _onInput: function onInput() {
	    this._checkInputValue();
	  },

	  _managePreventDefault: function managePreventDefault(keyName, $e) {
	    var preventDefault;
	    var hintValue;
	    var inputValue;

	    switch (keyName) {
	    case 'tab':
	      hintValue = this.getHint();
	      inputValue = this.getInputValue();

	      preventDefault = hintValue &&
	        hintValue !== inputValue &&
	        !withModifier($e);
	      break;

	    case 'up':
	    case 'down':
	      preventDefault = !withModifier($e);
	      break;

	    default:
	      preventDefault = false;
	    }

	    if (preventDefault) {
	      $e.preventDefault();
	    }
	  },

	  _shouldTrigger: function shouldTrigger(keyName, $e) {
	    var trigger;

	    switch (keyName) {
	    case 'tab':
	      trigger = !withModifier($e);
	      break;

	    default:
	      trigger = true;
	    }

	    return trigger;
	  },

	  _checkInputValue: function checkInputValue() {
	    var inputValue;
	    var areEquivalent;
	    var hasDifferentWhitespace;

	    inputValue = this.getInputValue();
	    areEquivalent = areQueriesEquivalent(inputValue, this.query);
	    hasDifferentWhitespace = areEquivalent && this.query ?
	      this.query.length !== inputValue.length : false;

	    this.query = inputValue;

	    if (!areEquivalent) {
	      this.trigger('queryChanged', this.query);
	    } else if (hasDifferentWhitespace) {
	      this.trigger('whitespaceChanged', this.query);
	    }
	  },

	  // ### public

	  focus: function focus() {
	    this.$input.focus();
	  },

	  blur: function blur() {
	    this.$input.blur();
	  },

	  getQuery: function getQuery() {
	    return this.query;
	  },

	  setQuery: function setQuery(query) {
	    this.query = query;
	  },

	  getInputValue: function getInputValue() {
	    return this.$input.val();
	  },

	  setInputValue: function setInputValue(value, silent) {
	    if (typeof value === 'undefined') {
	      value = this.query;
	    }
	    this.$input.val(value);

	    // silent prevents any additional events from being triggered
	    if (silent) {
	      this.clearHint();
	    } else {
	      this._checkInputValue();
	    }
	  },

	  expand: function expand() {
	    this.$input.attr('aria-expanded', 'true');
	  },

	  collapse: function collapse() {
	    this.$input.attr('aria-expanded', 'false');
	  },

	  setActiveDescendant: function setActiveDescendant(activedescendantId) {
	    this.$input.attr('aria-activedescendant', activedescendantId);
	  },

	  removeActiveDescendant: function removeActiveDescendant() {
	    this.$input.removeAttr('aria-activedescendant');
	  },

	  resetInputValue: function resetInputValue() {
	    this.setInputValue(this.query, true);
	  },

	  getHint: function getHint() {
	    return this.$hint.val();
	  },

	  setHint: function setHint(value) {
	    this.$hint.val(value);
	  },

	  clearHint: function clearHint() {
	    this.setHint('');
	  },

	  clearHintIfInvalid: function clearHintIfInvalid() {
	    var val;
	    var hint;
	    var valIsPrefixOfHint;
	    var isValid;

	    val = this.getInputValue();
	    hint = this.getHint();
	    valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
	    isValid = val !== '' && valIsPrefixOfHint && !this.hasOverflow();

	    if (!isValid) {
	      this.clearHint();
	    }
	  },

	  getLanguageDirection: function getLanguageDirection() {
	    return (this.$input.css('direction') || 'ltr').toLowerCase();
	  },

	  hasOverflow: function hasOverflow() {
	    // 2 is arbitrary, just picking a small number to handle edge cases
	    var constraint = this.$input.width() - 2;

	    this.$overflowHelper.text(this.getInputValue());

	    return this.$overflowHelper.width() >= constraint;
	  },

	  isCursorAtEnd: function() {
	    var valueLength;
	    var selectionStart;
	    var range;

	    valueLength = this.$input.val().length;
	    selectionStart = this.$input[0].selectionStart;

	    if (_.isNumber(selectionStart)) {
	      return selectionStart === valueLength;
	    } else if (document.selection) {
	      // NOTE: this won't work unless the input has focus, the good news
	      // is this code should only get called when the input has focus
	      range = document.selection.createRange();
	      range.moveStart('character', -valueLength);

	      return valueLength === range.text.length;
	    }

	    return true;
	  },

	  destroy: function destroy() {
	    this.$hint.off('.aa');
	    this.$input.off('.aa');

	    this.$hint = this.$input = this.$overflowHelper = null;
	  }
	});

	// helper functions
	// ----------------

	function buildOverflowHelper($input) {
	  return DOM.element('<pre aria-hidden="true"></pre>')
	    .css({
	      // position helper off-screen
	      position: 'absolute',
	      visibility: 'hidden',
	      // avoid line breaks and whitespace collapsing
	      whiteSpace: 'pre',
	      // use same font css as input to calculate accurate width
	      fontFamily: $input.css('font-family'),
	      fontSize: $input.css('font-size'),
	      fontStyle: $input.css('font-style'),
	      fontVariant: $input.css('font-variant'),
	      fontWeight: $input.css('font-weight'),
	      wordSpacing: $input.css('word-spacing'),
	      letterSpacing: $input.css('letter-spacing'),
	      textIndent: $input.css('text-indent'),
	      textRendering: $input.css('text-rendering'),
	      textTransform: $input.css('text-transform')
	    })
	    .insertAfter($input);
	}

	function areQueriesEquivalent(a, b) {
	  return Input.normalizeQuery(a) === Input.normalizeQuery(b);
	}

	function withModifier($e) {
	  return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
	}

	module.exports = Input;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var immediate = __webpack_require__(9);
	var splitter = /\s+/;

	module.exports = {
	  onSync: onSync,
	  onAsync: onAsync,
	  off: off,
	  trigger: trigger
	};

	function on(method, types, cb, context) {
	  var type;

	  if (!cb) {
	    return this;
	  }

	  types = types.split(splitter);
	  cb = context ? bindContext(cb, context) : cb;

	  this._callbacks = this._callbacks || {};

	  while (type = types.shift()) {
	    this._callbacks[type] = this._callbacks[type] || {sync: [], async: []};
	    this._callbacks[type][method].push(cb);
	  }

	  return this;
	}

	function onAsync(types, cb, context) {
	  return on.call(this, 'async', types, cb, context);
	}

	function onSync(types, cb, context) {
	  return on.call(this, 'sync', types, cb, context);
	}

	function off(types) {
	  var type;

	  if (!this._callbacks) {
	    return this;
	  }

	  types = types.split(splitter);

	  while (type = types.shift()) {
	    delete this._callbacks[type];
	  }

	  return this;
	}

	function trigger(types) {
	  var type;
	  var callbacks;
	  var args;
	  var syncFlush;
	  var asyncFlush;

	  if (!this._callbacks) {
	    return this;
	  }

	  types = types.split(splitter);
	  args = [].slice.call(arguments, 1);

	  while ((type = types.shift()) && (callbacks = this._callbacks[type])) { // eslint-disable-line
	    syncFlush = getFlush(callbacks.sync, this, [type].concat(args));
	    asyncFlush = getFlush(callbacks.async, this, [type].concat(args));

	    if (syncFlush()) {
	      immediate(asyncFlush);
	    }
	  }

	  return this;
	}

	function getFlush(callbacks, context, args) {
	  return flush;

	  function flush() {
	    var cancelled;

	    for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
	      // only cancel if the callback explicitly returns false
	      cancelled = callbacks[i].apply(context, args) === false;
	    }

	    return !cancelled;
	  }
	}

	function bindContext(fn, context) {
	  return fn.bind ?
	    fn.bind(context) :
	    function() { fn.apply(context, [].slice.call(arguments, 0)); };
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var types = [
	  __webpack_require__(10),
	  __webpack_require__(12),
	  __webpack_require__(13),
	  __webpack_require__(14),
	  __webpack_require__(15)
	];
	var draining;
	var currentQueue;
	var queueIndex = -1;
	var queue = [];
	var scheduled = false;
	function cleanUpNextTick() {
	  if (!draining || !currentQueue) {
	    return;
	  }
	  draining = false;
	  if (currentQueue.length) {
	    queue = currentQueue.concat(queue);
	  } else {
	    queueIndex = -1;
	  }
	  if (queue.length) {
	    nextTick();
	  }
	}

	//named nextTick for less confusing stack traces
	function nextTick() {
	  if (draining) {
	    return;
	  }
	  scheduled = false;
	  draining = true;
	  var len = queue.length;
	  var timeout = setTimeout(cleanUpNextTick);
	  while (len) {
	    currentQueue = queue;
	    queue = [];
	    while (currentQueue && ++queueIndex < len) {
	      currentQueue[queueIndex].run();
	    }
	    queueIndex = -1;
	    len = queue.length;
	  }
	  currentQueue = null;
	  queueIndex = -1;
	  draining = false;
	  clearTimeout(timeout);
	}
	var scheduleDrain;
	var i = -1;
	var len = types.length;
	while (++i < len) {
	  if (types[i] && types[i].test && types[i].test()) {
	    scheduleDrain = types[i].install(nextTick);
	    break;
	  }
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	  this.fun = fun;
	  this.array = array;
	}
	Item.prototype.run = function () {
	  var fun = this.fun;
	  var array = this.array;
	  switch (array.length) {
	  case 0:
	    return fun();
	  case 1:
	    return fun(array[0]);
	  case 2:
	    return fun(array[0], array[1]);
	  case 3:
	    return fun(array[0], array[1], array[2]);
	  default:
	    return fun.apply(null, array);
	  }

	};
	module.exports = immediate;
	function immediate(task) {
	  var args = new Array(arguments.length - 1);
	  if (arguments.length > 1) {
	    for (var i = 1; i < arguments.length; i++) {
	      args[i - 1] = arguments[i];
	    }
	  }
	  queue.push(new Item(task, args));
	  if (!scheduled && !draining) {
	    scheduled = true;
	    scheduleDrain();
	  }
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	exports.test = function () {
	  // Don't get fooled by e.g. browserify environments.
	  return (typeof process !== 'undefined') && !process.browser;
	};

	exports.install = function (func) {
	  return function () {
	    process.nextTick(func);
	  };
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ },
/* 11 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 12 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	//based off rsvp https://github.com/tildeio/rsvp.js
	//license https://github.com/tildeio/rsvp.js/blob/master/LICENSE
	//https://github.com/tildeio/rsvp.js/blob/master/lib/rsvp/asap.js

	var Mutation = global.MutationObserver || global.WebKitMutationObserver;

	exports.test = function () {
	  return Mutation;
	};

	exports.install = function (handle) {
	  var called = 0;
	  var observer = new Mutation(handle);
	  var element = global.document.createTextNode('');
	  observer.observe(element, {
	    characterData: true
	  });
	  return function () {
	    element.data = (called = ++called % 2);
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	exports.test = function () {
	  if (global.setImmediate) {
	    // we can only get here in IE10
	    // which doesn't handel postMessage well
	    return false;
	  }
	  return typeof global.MessageChannel !== 'undefined';
	};

	exports.install = function (func) {
	  var channel = new global.MessageChannel();
	  channel.port1.onmessage = func;
	  return function () {
	    channel.port2.postMessage(0);
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 14 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	exports.test = function () {
	  return 'document' in global && 'onreadystatechange' in global.document.createElement('script');
	};

	exports.install = function (handle) {
	  return function () {

	    // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	    // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	    var scriptEl = global.document.createElement('script');
	    scriptEl.onreadystatechange = function () {
	      handle();

	      scriptEl.onreadystatechange = null;
	      scriptEl.parentNode.removeChild(scriptEl);
	      scriptEl = null;
	    };
	    global.document.documentElement.appendChild(scriptEl);

	    return handle;
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	exports.test = function () {
	  return true;
	};

	exports.install = function (t) {
	  return function () {
	    setTimeout(t, 0);
	  };
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(4);
	var DOM = __webpack_require__(3);
	var EventEmitter = __webpack_require__(8);
	var Dataset = __webpack_require__(17);
	var css = __webpack_require__(19);

	// constructor
	// -----------

	function Dropdown(o) {
	  var that = this;
	  var onSuggestionClick;
	  var onSuggestionMouseEnter;
	  var onSuggestionMouseLeave;

	  o = o || {};

	  if (!o.menu) {
	    _.error('menu is required');
	  }

	  if (!_.isArray(o.datasets) && !_.isObject(o.datasets)) {
	    _.error('1 or more datasets required');
	  }
	  if (!o.datasets) {
	    _.error('datasets is required');
	  }

	  this.isOpen = false;
	  this.isEmpty = true;
	  this.minLength = o.minLength || 0;
	  this.templates = {};
	  this.appendTo = o.appendTo || false;
	  this.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
	  this.cssClasses = o.cssClasses = _.mixin({}, css.defaultClasses, o.cssClasses || {});
	  this.cssClasses.prefix =
	    o.cssClasses.formattedPrefix || _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);

	  // bound functions
	  onSuggestionClick = _.bind(this._onSuggestionClick, this);
	  onSuggestionMouseEnter = _.bind(this._onSuggestionMouseEnter, this);
	  onSuggestionMouseLeave = _.bind(this._onSuggestionMouseLeave, this);

	  var cssClass = _.className(this.cssClasses.prefix, this.cssClasses.suggestion);
	  this.$menu = DOM.element(o.menu)
	    .on('mouseenter.aa', cssClass, onSuggestionMouseEnter)
	    .on('mouseleave.aa', cssClass, onSuggestionMouseLeave)
	    .on('click.aa', cssClass, onSuggestionClick);

	  this.$container = o.appendTo ? o.wrapper : this.$menu;

	  if (o.templates && o.templates.header) {
	    this.templates.header = _.templatify(o.templates.header);
	    this.$menu.prepend(this.templates.header());
	  }

	  if (o.templates && o.templates.empty) {
	    this.templates.empty = _.templatify(o.templates.empty);
	    this.$empty = DOM.element('<div class="' +
	      _.className(this.cssClasses.prefix, this.cssClasses.empty, true) + '">' +
	      '</div>');
	    this.$menu.append(this.$empty);
	    this.$empty.hide();
	  }

	  this.datasets = _.map(o.datasets, function(oDataset) {
	    return initializeDataset(that.$menu, oDataset, o.cssClasses);
	  });
	  _.each(this.datasets, function(dataset) {
	    var root = dataset.getRoot();
	    if (root && root.parent().length === 0) {
	      that.$menu.append(root);
	    }
	    dataset.onSync('rendered', that._onRendered, that);
	  });

	  if (o.templates && o.templates.footer) {
	    this.templates.footer = _.templatify(o.templates.footer);
	    this.$menu.append(this.templates.footer());
	  }

	  var self = this;
	  DOM.element(window).resize(function() {
	    self._redraw();
	  });
	}

	// instance methods
	// ----------------

	_.mixin(Dropdown.prototype, EventEmitter, {

	  // ### private

	  _onSuggestionClick: function onSuggestionClick($e) {
	    this.trigger('suggestionClicked', DOM.element($e.currentTarget));
	  },

	  _onSuggestionMouseEnter: function onSuggestionMouseEnter($e) {
	    var elt = DOM.element($e.currentTarget);
	    if (elt.hasClass(_.className(this.cssClasses.prefix, this.cssClasses.cursor, true))) {
	      // we're already on the cursor
	      // => we're probably entering it again after leaving it for a nested div
	      return;
	    }
	    this._removeCursor();

	    // Fixes iOS double tap behaviour, by modifying the DOM right before the
	    // native href clicks happens, iOS will requires another tap to follow
	    // a suggestion that has an <a href> element inside
	    // https://www.google.com/search?q=ios+double+tap+bug+href
	    var suggestion = this;
	    setTimeout(function() {
	      // this exact line, when inside the main loop, will trigger a double tap bug
	      // on iOS devices
	      suggestion._setCursor(elt, false);
	    }, 0);
	  },

	  _onSuggestionMouseLeave: function onSuggestionMouseLeave($e) {
	    // $e.relatedTarget is the `EventTarget` the pointing device entered to
	    if ($e.relatedTarget) {
	      var elt = DOM.element($e.relatedTarget);
	      if (elt.closest('.' + _.className(this.cssClasses.prefix, this.cssClasses.cursor, true)).length > 0) {
	        // our father is a cursor
	        // => it means we're just leaving the suggestion for a nested div
	        return;
	      }
	    }
	    this._removeCursor();
	    this.trigger('cursorRemoved');
	  },

	  _onRendered: function onRendered(e, query) {
	    this.isEmpty = _.every(this.datasets, isDatasetEmpty);

	    if (this.isEmpty) {
	      if (query.length >= this.minLength) {
	        this.trigger('empty');
	      }

	      if (this.$empty) {
	        if (query.length < this.minLength) {
	          this._hide();
	        } else {
	          var html = this.templates.empty({
	            query: this.datasets[0] && this.datasets[0].query
	          });
	          this.$empty.html(html);
	          this.$empty.show();
	          this._show();
	        }
	      } else if (_.any(this.datasets, hasEmptyTemplate)) {
	        if (query.length < this.minLength) {
	          this._hide();
	        } else {
	          this._show();
	        }
	      } else {
	        this._hide();
	      }
	    } else if (this.isOpen) {
	      if (this.$empty) {
	        this.$empty.empty();
	        this.$empty.hide();
	      }

	      if (query.length >= this.minLength) {
	        this._show();
	      } else {
	        this._hide();
	      }
	    }

	    this.trigger('datasetRendered');

	    function isDatasetEmpty(dataset) {
	      return dataset.isEmpty();
	    }

	    function hasEmptyTemplate(dataset) {
	      return dataset.templates && dataset.templates.empty;
	    }
	  },

	  _hide: function() {
	    this.$container.hide();
	  },

	  _show: function() {
	    // can't use jQuery#show because $menu is a span element we want
	    // display: block; not dislay: inline;
	    this.$container.css('display', 'block');

	    this._redraw();

	    this.trigger('shown');
	  },

	  _redraw: function redraw() {
	    if (!this.isOpen || !this.appendTo) return;

	    this.trigger('redrawn');
	  },

	  _getSuggestions: function getSuggestions() {
	    return this.$menu.find(_.className(this.cssClasses.prefix, this.cssClasses.suggestion));
	  },

	  _getCursor: function getCursor() {
	    return this.$menu.find(_.className(this.cssClasses.prefix, this.cssClasses.cursor)).first();
	  },

	  _setCursor: function setCursor($el, updateInput) {
	    $el.first()
	      .addClass(_.className(this.cssClasses.prefix, this.cssClasses.cursor, true))
	      .attr('aria-selected', 'true');
	    this.trigger('cursorMoved', updateInput);
	  },

	  _removeCursor: function removeCursor() {
	    this._getCursor()
	      .removeClass(_.className(this.cssClasses.prefix, this.cssClasses.cursor, true))
	      .removeAttr('aria-selected');
	  },

	  _moveCursor: function moveCursor(increment) {
	    var $suggestions;
	    var $oldCursor;
	    var newCursorIndex;
	    var $newCursor;

	    if (!this.isOpen) {
	      return;
	    }

	    $oldCursor = this._getCursor();
	    $suggestions = this._getSuggestions();

	    this._removeCursor();

	    // shifting before and after modulo to deal with -1 index
	    newCursorIndex = $suggestions.index($oldCursor) + increment;
	    newCursorIndex = (newCursorIndex + 1) % ($suggestions.length + 1) - 1;

	    if (newCursorIndex === -1) {
	      this.trigger('cursorRemoved');

	      return;
	    } else if (newCursorIndex < -1) {
	      newCursorIndex = $suggestions.length - 1;
	    }

	    this._setCursor($newCursor = $suggestions.eq(newCursorIndex), true);

	    // in the case of scrollable overflow
	    // make sure the cursor is visible in the menu
	    this._ensureVisible($newCursor);
	  },

	  _ensureVisible: function ensureVisible($el) {
	    var elTop;
	    var elBottom;
	    var menuScrollTop;
	    var menuHeight;

	    elTop = $el.position().top;
	    elBottom = elTop + $el.height() +
	      parseInt($el.css('margin-top'), 10) +
	      parseInt($el.css('margin-bottom'), 10);
	    menuScrollTop = this.$menu.scrollTop();
	    menuHeight = this.$menu.height() +
	      parseInt(this.$menu.css('padding-top'), 10) +
	      parseInt(this.$menu.css('padding-bottom'), 10);

	    if (elTop < 0) {
	      this.$menu.scrollTop(menuScrollTop + elTop);
	    } else if (menuHeight < elBottom) {
	      this.$menu.scrollTop(menuScrollTop + (elBottom - menuHeight));
	    }
	  },

	  // ### public

	  close: function close() {
	    if (this.isOpen) {
	      this.isOpen = false;

	      this._removeCursor();
	      this._hide();

	      this.trigger('closed');
	    }
	  },

	  open: function open() {
	    if (!this.isOpen) {
	      this.isOpen = true;

	      if (!this.isEmpty) {
	        this._show();
	      }

	      this.trigger('opened');
	    }
	  },

	  setLanguageDirection: function setLanguageDirection(dir) {
	    this.$menu.css(dir === 'ltr' ? this.css.ltr : this.css.rtl);
	  },

	  moveCursorUp: function moveCursorUp() {
	    this._moveCursor(-1);
	  },

	  moveCursorDown: function moveCursorDown() {
	    this._moveCursor(+1);
	  },

	  getDatumForSuggestion: function getDatumForSuggestion($el) {
	    var datum = null;

	    if ($el.length) {
	      datum = {
	        raw: Dataset.extractDatum($el),
	        value: Dataset.extractValue($el),
	        datasetName: Dataset.extractDatasetName($el)
	      };
	    }

	    return datum;
	  },

	  getCurrentCursor: function getCurrentCursor() {
	    return this._getCursor().first();
	  },

	  getDatumForCursor: function getDatumForCursor() {
	    return this.getDatumForSuggestion(this._getCursor().first());
	  },

	  getDatumForTopSuggestion: function getDatumForTopSuggestion() {
	    return this.getDatumForSuggestion(this._getSuggestions().first());
	  },

	  cursorTopSuggestion: function cursorTopSuggestion() {
	    this._setCursor(this._getSuggestions().first(), false);
	  },

	  update: function update(query) {
	    _.each(this.datasets, updateDataset);

	    function updateDataset(dataset) {
	      dataset.update(query);
	    }
	  },

	  empty: function empty() {
	    _.each(this.datasets, clearDataset);
	    this.isEmpty = true;

	    function clearDataset(dataset) {
	      dataset.clear();
	    }
	  },

	  isVisible: function isVisible() {
	    return this.isOpen && !this.isEmpty;
	  },

	  destroy: function destroy() {
	    this.$menu.off('.aa');

	    this.$menu = null;

	    _.each(this.datasets, destroyDataset);

	    function destroyDataset(dataset) {
	      dataset.destroy();
	    }
	  }
	});

	// helper functions
	// ----------------
	Dropdown.Dataset = Dataset;

	function initializeDataset($menu, oDataset, cssClasses) {
	  return new Dropdown.Dataset(_.mixin({$menu: $menu, cssClasses: cssClasses}, oDataset));
	}

	module.exports = Dropdown;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var datasetKey = 'aaDataset';
	var valueKey = 'aaValue';
	var datumKey = 'aaDatum';

	var _ = __webpack_require__(4);
	var DOM = __webpack_require__(3);
	var html = __webpack_require__(18);
	var css = __webpack_require__(19);
	var EventEmitter = __webpack_require__(8);

	// constructor
	// -----------

	function Dataset(o) {
	  o = o || {};
	  o.templates = o.templates || {};

	  if (!o.source) {
	    _.error('missing source');
	  }

	  if (o.name && !isValidName(o.name)) {
	    _.error('invalid dataset name: ' + o.name);
	  }

	  // tracks the last query the dataset was updated for
	  this.query = null;
	  this._isEmpty = true;

	  this.highlight = !!o.highlight;
	  this.name = typeof o.name === 'undefined' || o.name === null ? _.getUniqueId() : o.name;

	  this.source = o.source;
	  this.displayFn = getDisplayFn(o.display || o.displayKey);

	  this.debounce = o.debounce;

	  this.cache = o.cache !== false;

	  this.templates = getTemplates(o.templates, this.displayFn);

	  this.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
	  this.cssClasses = o.cssClasses = _.mixin({}, css.defaultClasses, o.cssClasses || {});
	  this.cssClasses.prefix =
	    o.cssClasses.formattedPrefix || _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);

	  var clazz = _.className(this.cssClasses.prefix, this.cssClasses.dataset);
	  this.$el = o.$menu && o.$menu.find(clazz + '-' + this.name).length > 0 ?
	    DOM.element(o.$menu.find(clazz + '-' + this.name)[0]) :
	    DOM.element(
	      html.dataset.replace('%CLASS%', this.name)
	        .replace('%PREFIX%', this.cssClasses.prefix)
	        .replace('%DATASET%', this.cssClasses.dataset)
	    );

	  this.$menu = o.$menu;
	  this.clearCachedSuggestions();
	}

	// static methods
	// --------------

	Dataset.extractDatasetName = function extractDatasetName(el) {
	  return DOM.element(el).data(datasetKey);
	};

	Dataset.extractValue = function extractValue(el) {
	  return DOM.element(el).data(valueKey);
	};

	Dataset.extractDatum = function extractDatum(el) {
	  var datum = DOM.element(el).data(datumKey);
	  if (typeof datum === 'string') {
	    // Zepto has an automatic deserialization of the
	    // JSON encoded data attribute
	    datum = JSON.parse(datum);
	  }
	  return datum;
	};

	// instance methods
	// ----------------

	_.mixin(Dataset.prototype, EventEmitter, {

	  // ### private

	  _render: function render(query, suggestions) {
	    if (!this.$el) {
	      return;
	    }
	    var that = this;

	    var hasSuggestions;
	    var renderArgs = [].slice.call(arguments, 2);
	    this.$el.empty();

	    hasSuggestions = suggestions && suggestions.length;
	    this._isEmpty = !hasSuggestions;

	    if (!hasSuggestions && this.templates.empty) {
	      this.$el
	        .html(getEmptyHtml.apply(this, renderArgs))
	        .prepend(that.templates.header ? getHeaderHtml.apply(this, renderArgs) : null)
	        .append(that.templates.footer ? getFooterHtml.apply(this, renderArgs) : null);
	    } else if (hasSuggestions) {
	      this.$el
	        .html(getSuggestionsHtml.apply(this, renderArgs))
	        .prepend(that.templates.header ? getHeaderHtml.apply(this, renderArgs) : null)
	        .append(that.templates.footer ? getFooterHtml.apply(this, renderArgs) : null);
	    } else if (suggestions && !Array.isArray(suggestions)) {
	      throw new TypeError('suggestions must be an array');
	    }

	    if (this.$menu) {
	      this.$menu.addClass(
	        this.cssClasses.prefix + (hasSuggestions ? 'with' : 'without') + '-' + this.name
	      ).removeClass(
	        this.cssClasses.prefix + (hasSuggestions ? 'without' : 'with') + '-' + this.name
	      );
	    }

	    this.trigger('rendered', query);

	    function getEmptyHtml() {
	      var args = [].slice.call(arguments, 0);
	      args = [{query: query, isEmpty: true}].concat(args);
	      return that.templates.empty.apply(this, args);
	    }

	    function getSuggestionsHtml() {
	      var args = [].slice.call(arguments, 0);
	      var $suggestions;
	      var nodes;
	      var self = this;

	      var suggestionsHtml = html.suggestions.
	        replace('%PREFIX%', this.cssClasses.prefix).
	        replace('%SUGGESTIONS%', this.cssClasses.suggestions);
	      $suggestions = DOM
	        .element(suggestionsHtml)
	        .css(this.css.suggestions);

	      // jQuery#append doesn't support arrays as the first argument
	      // until version 1.8, see http://bugs.jquery.com/ticket/11231
	      nodes = _.map(suggestions, getSuggestionNode);
	      $suggestions.append.apply($suggestions, nodes);

	      return $suggestions;

	      function getSuggestionNode(suggestion) {
	        var $el;

	        var suggestionHtml = html.suggestion.
	          replace('%PREFIX%', self.cssClasses.prefix).
	          replace('%SUGGESTION%', self.cssClasses.suggestion);
	        $el = DOM.element(suggestionHtml)
	          .attr({
	            role: 'option',
	            id: ['option', Math.floor(Math.random() * 100000000)].join('-')
	          })
	          .append(that.templates.suggestion.apply(this, [suggestion].concat(args)));

	        $el.data(datasetKey, that.name);
	        $el.data(valueKey, that.displayFn(suggestion) || undefined); // this led to undefined return value
	        $el.data(datumKey, JSON.stringify(suggestion));
	        $el.children().each(function() { DOM.element(this).css(self.css.suggestionChild); });

	        return $el;
	      }
	    }

	    function getHeaderHtml() {
	      var args = [].slice.call(arguments, 0);
	      args = [{query: query, isEmpty: !hasSuggestions}].concat(args);
	      return that.templates.header.apply(this, args);
	    }

	    function getFooterHtml() {
	      var args = [].slice.call(arguments, 0);
	      args = [{query: query, isEmpty: !hasSuggestions}].concat(args);
	      return that.templates.footer.apply(this, args);
	    }
	  },

	  // ### public

	  getRoot: function getRoot() {
	    return this.$el;
	  },

	  update: function update(query) {
	    function handleSuggestions(suggestions) {
	      // if the update has been canceled or if the query has changed
	      // do not render the suggestions as they've become outdated
	      if (!this.canceled && query === this.query) {
	        // concat all the other arguments that could have been passed
	        // to the render function, and forward them to _render
	        var extraArgs = [].slice.call(arguments, 1);
	        this.cacheSuggestions(query, suggestions, extraArgs);
	        this._render.apply(this, [query, suggestions].concat(extraArgs));
	      }
	    }

	    this.query = query;
	    this.canceled = false;

	    if (this.shouldFetchFromCache(query)) {
	      handleSuggestions.apply(this, [this.cachedSuggestions].concat(this.cachedRenderExtraArgs));
	    } else {
	      var that = this;
	      var execSource = function() {
	        // When the call is debounced the condition avoid to do a useless
	        // request with the last character when the input has been cleared
	        if (!that.canceled) {
	          that.source(query, handleSuggestions.bind(that));
	        }
	      };

	      if (this.debounce) {
	        var later = function() {
	          that.debounceTimeout = null;
	          execSource();
	        };
	        clearTimeout(this.debounceTimeout);
	        this.debounceTimeout = setTimeout(later, this.debounce);
	      } else {
	        execSource();
	      }
	    }
	  },

	  cacheSuggestions: function cacheSuggestions(query, suggestions, extraArgs) {
	    this.cachedQuery = query;
	    this.cachedSuggestions = suggestions;
	    this.cachedRenderExtraArgs = extraArgs;
	  },

	  shouldFetchFromCache: function shouldFetchFromCache(query) {
	    return this.cache &&
	      this.cachedQuery === query &&
	      this.cachedSuggestions &&
	      this.cachedSuggestions.length;
	  },

	  clearCachedSuggestions: function clearCachedSuggestions() {
	    delete this.cachedQuery;
	    delete this.cachedSuggestions;
	    delete this.cachedRenderExtraArgs;
	  },

	  cancel: function cancel() {
	    this.canceled = true;
	  },

	  clear: function clear() {
	    this.cancel();
	    this.$el.empty();
	    this.trigger('rendered', '');
	  },

	  isEmpty: function isEmpty() {
	    return this._isEmpty;
	  },

	  destroy: function destroy() {
	    this.clearCachedSuggestions();
	    this.$el = null;
	  }
	});

	// helper functions
	// ----------------

	function getDisplayFn(display) {
	  display = display || 'value';

	  return _.isFunction(display) ? display : displayFn;

	  function displayFn(obj) {
	    return obj[display];
	  }
	}

	function getTemplates(templates, displayFn) {
	  return {
	    empty: templates.empty && _.templatify(templates.empty),
	    header: templates.header && _.templatify(templates.header),
	    footer: templates.footer && _.templatify(templates.footer),
	    suggestion: templates.suggestion || suggestionTemplate
	  };

	  function suggestionTemplate(context) {
	    return '<p>' + displayFn(context) + '</p>';
	  }
	}

	function isValidName(str) {
	  // dashes, underscores, letters, and numbers
	  return (/^[_a-zA-Z0-9-]+$/).test(str);
	}

	module.exports = Dataset;


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  wrapper: '<span class="%ROOT%"></span>',
	  dropdown: '<span class="%PREFIX%%DROPDOWN_MENU%"></span>',
	  dataset: '<div class="%PREFIX%%DATASET%-%CLASS%"></div>',
	  suggestions: '<span class="%PREFIX%%SUGGESTIONS%"></span>',
	  suggestion: '<div class="%PREFIX%%SUGGESTION%"></div>'
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(4);

	var css = {
	  wrapper: {
	    position: 'relative',
	    display: 'inline-block'
	  },
	  hint: {
	    position: 'absolute',
	    top: '0',
	    left: '0',
	    borderColor: 'transparent',
	    boxShadow: 'none',
	    // #741: fix hint opacity issue on iOS
	    opacity: '1'
	  },
	  input: {
	    position: 'relative',
	    verticalAlign: 'top',
	    backgroundColor: 'transparent'
	  },
	  inputWithNoHint: {
	    position: 'relative',
	    verticalAlign: 'top'
	  },
	  dropdown: {
	    position: 'absolute',
	    top: '100%',
	    left: '0',
	    zIndex: '100',
	    display: 'none'
	  },
	  suggestions: {
	    display: 'block'
	  },
	  suggestion: {
	    whiteSpace: 'nowrap',
	    cursor: 'pointer'
	  },
	  suggestionChild: {
	    whiteSpace: 'normal'
	  },
	  ltr: {
	    left: '0',
	    right: 'auto'
	  },
	  rtl: {
	    left: 'auto',
	    right: '0'
	  },
	  defaultClasses: {
	    root: 'algolia-autocomplete',
	    prefix: 'aa',
	    noPrefix: false,
	    dropdownMenu: 'dropdown-menu',
	    input: 'input',
	    hint: 'hint',
	    suggestions: 'suggestions',
	    suggestion: 'suggestion',
	    cursor: 'cursor',
	    dataset: 'dataset',
	    empty: 'empty'
	  },
	  // will be merged with the default ones if appendTo is used
	  appendTo: {
	    wrapper: {
	      position: 'absolute',
	      zIndex: '100',
	      display: 'none'
	    },
	    input: {},
	    inputWithNoHint: {},
	    dropdown: {
	      display: 'block'
	    }
	  }
	};

	// ie specific styling
	if (_.isMsie()) {
	  // ie6-8 (and 9?) doesn't fire hover and click events for elements with
	  // transparent backgrounds, for a workaround, use 1x1 transparent gif
	  _.mixin(css.input, {
	    backgroundImage: 'url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)'
	  });
	}

	// ie7 and under specific styling
	if (_.isMsie() && _.isMsie() <= 7) {
	  // if someone can tell me why this is necessary to align
	  // the hint with the query in ie7, i'll send you $5 - @JakeHarding
	  _.mixin(css.input, {marginTop: '-1px'});
	}

	module.exports = css;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  hits: __webpack_require__(21),
	  popularIn: __webpack_require__(24)
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(4);
	var version = __webpack_require__(22);
	var parseAlgoliaClientVersion = __webpack_require__(23);

	module.exports = function search(index, params) {
	  var algoliaVersion = parseAlgoliaClientVersion(index.as._ua);
	  if (algoliaVersion && algoliaVersion[0] >= 3 && algoliaVersion[1] > 20) {
	    params = params || {};
	    params.additionalUA = 'autocomplete.js ' + version;
	  }
	  return sourceFn;

	  function sourceFn(query, cb) {
	    index.search(query, params, function(error, content) {
	      if (error) {
	        _.error(error.message);
	        return;
	      }
	      cb(content.hits, content);
	    });
	  }
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "0.36.0";


/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function parseAlgoliaClientVersion(agent) {
	  var parsed = agent.match(/Algolia for vanilla JavaScript (\d+\.)(\d+\.)(\d+)/);
	  if (parsed) return [parsed[1], parsed[2], parsed[3]];
	  return undefined;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(4);
	var version = __webpack_require__(22);
	var parseAlgoliaClientVersion = __webpack_require__(23);

	module.exports = function popularIn(index, params, details, options) {
	  var algoliaVersion = parseAlgoliaClientVersion(index.as._ua);
	  if (algoliaVersion && algoliaVersion[0] >= 3 && algoliaVersion[1] > 20) {
	    params = params || {};
	    params.additionalUA = 'autocomplete.js ' + version;
	  }
	  if (!details.source) {
	    return _.error("Missing 'source' key");
	  }
	  var source = _.isFunction(details.source) ? details.source : function(hit) { return hit[details.source]; };

	  if (!details.index) {
	    return _.error("Missing 'index' key");
	  }
	  var detailsIndex = details.index;

	  options = options || {};

	  return sourceFn;

	  function sourceFn(query, cb) {
	    index.search(query, params, function(error, content) {
	      if (error) {
	        _.error(error.message);
	        return;
	      }

	      if (content.hits.length > 0) {
	        var first = content.hits[0];

	        var detailsParams = _.mixin({hitsPerPage: 0}, details);
	        delete detailsParams.source; // not a query parameter
	        delete detailsParams.index; // not a query parameter

	        var detailsAlgoliaVersion = parseAlgoliaClientVersion(detailsIndex.as._ua);
	        if (detailsAlgoliaVersion && detailsAlgoliaVersion[0] >= 3 && detailsAlgoliaVersion[1] > 20) {
	          params.additionalUA = 'autocomplete.js ' + version;
	        }

	        detailsIndex.search(source(first), detailsParams, function(error2, content2) {
	          if (error2) {
	            _.error(error2.message);
	            return;
	          }

	          var suggestions = [];

	          // add the 'all department' entry before others
	          if (options.includeAll) {
	            var label = options.allTitle || 'All departments';
	            suggestions.push(_.mixin({
	              facet: {value: label, count: content2.nbHits}
	            }, _.cloneDeep(first)));
	          }

	          // enrich the first hit iterating over the facets
	          _.each(content2.facets, function(values, facet) {
	            _.each(values, function(count, value) {
	              suggestions.push(_.mixin({
	                facet: {facet: facet, value: value, count: count}
	              }, _.cloneDeep(first)));
	            });
	          });

	          // append all other hits
	          for (var i = 1; i < content.hits.length; ++i) {
	            suggestions.push(content.hits[i]);
	          }

	          cb(suggestions, content);
	        });

	        return;
	      }

	      cb([]);
	    });
	  }
	};


/***/ }
/******/ ]);