'use strict';

var _ = require('../common/utils.js');
var DOM = require('../common/dom.js');
var EventEmitter = require('./event_emitter.js');
var Dataset = require('./dataset.js');
var css = require('./css.js');

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
