'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hogan = require('hogan.js');

var _hogan2 = _interopRequireDefault(_hogan);

var _lite = require('algoliasearch/lite');

var _lite2 = _interopRequireDefault(_lite);

var _autocomplete = require('autocomplete.js');

var _autocomplete2 = _interopRequireDefault(_autocomplete);

var _templates = require('./templates');

var _templates2 = _interopRequireDefault(_templates);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _version = require('./version');

var _version2 = _interopRequireDefault(_version);

var _zepto = require('./zepto');

var _zepto2 = _interopRequireDefault(_zepto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Adds an autocomplete dropdown to an input field
 * @function DocSearch
 * @param  {string} options.apiKey         Read-only API key
 * @param  {string} options.indexName      Name of the index to target
 * @param  {string} options.inputSelector  CSS selector that targets the input
 * @param  {string} [options.appId]  Lets you override the applicationId used.
 * If using the default Algolia Crawler, you should not have to change this
 * value.
 * @param  {Object} [options.algoliaOptions] Options to pass the underlying Algolia client
 * @param  {Object} [options.autocompleteOptions] Options to pass to the underlying autocomplete instance
 * @return {Object}
 */
var usage = 'Usage:\n  documentationSearch({\n  apiKey,\n  indexName,\n  inputSelector,\n  [ appId ],\n  [ algoliaOptions.{hitsPerPage} ]\n  [ autocompleteOptions.{hint,debug} ]\n})';

var DocSearch = function () {
  function DocSearch(_ref) {
    var apiKey = _ref.apiKey,
        indexName = _ref.indexName,
        inputSelector = _ref.inputSelector,
        _ref$appId = _ref.appId,
        appId = _ref$appId === undefined ? 'BH4D9OD16A' : _ref$appId,
        _ref$debug = _ref.debug,
        debug = _ref$debug === undefined ? false : _ref$debug,
        _ref$algoliaOptions = _ref.algoliaOptions,
        algoliaOptions = _ref$algoliaOptions === undefined ? {} : _ref$algoliaOptions,
        _ref$queryDataCallbac = _ref.queryDataCallback,
        queryDataCallback = _ref$queryDataCallbac === undefined ? null : _ref$queryDataCallbac,
        _ref$autocompleteOpti = _ref.autocompleteOptions,
        autocompleteOptions = _ref$autocompleteOpti === undefined ? {
      debug: false,
      hint: false,
      autoselect: true
    } : _ref$autocompleteOpti,
        _ref$transformData = _ref.transformData,
        transformData = _ref$transformData === undefined ? false : _ref$transformData,
        _ref$queryHook = _ref.queryHook,
        queryHook = _ref$queryHook === undefined ? false : _ref$queryHook,
        _ref$handleSelected = _ref.handleSelected,
        handleSelected = _ref$handleSelected === undefined ? false : _ref$handleSelected,
        _ref$enhancedSearchIn = _ref.enhancedSearchInput,
        enhancedSearchInput = _ref$enhancedSearchIn === undefined ? false : _ref$enhancedSearchIn,
        _ref$layout = _ref.layout,
        layout = _ref$layout === undefined ? 'collumns' : _ref$layout;

    _classCallCheck(this, DocSearch);

    DocSearch.checkArguments({
      apiKey: apiKey,
      indexName: indexName,
      inputSelector: inputSelector,
      debug: debug,
      algoliaOptions: algoliaOptions,
      queryDataCallback: queryDataCallback,
      autocompleteOptions: autocompleteOptions,
      transformData: transformData,
      queryHook: queryHook,
      handleSelected: handleSelected,
      enhancedSearchInput: enhancedSearchInput,
      layout: layout
    });

    this.apiKey = apiKey;
    this.appId = appId;
    this.indexName = indexName;
    this.input = DocSearch.getInputFromSelector(inputSelector);
    this.algoliaOptions = _extends({ hitsPerPage: 5 }, algoliaOptions);
    this.queryDataCallback = queryDataCallback || null;
    var autocompleteOptionsDebug = autocompleteOptions && autocompleteOptions.debug ? autocompleteOptions.debug : false;
    // eslint-disable-next-line no-param-reassign
    autocompleteOptions.debug = debug || autocompleteOptionsDebug;
    this.autocompleteOptions = autocompleteOptions;
    this.autocompleteOptions.cssClasses = this.autocompleteOptions.cssClasses || {};
    this.autocompleteOptions.cssClasses.prefix = this.autocompleteOptions.cssClasses.prefix || 'ds';
    var inputAriaLabel = this.input && typeof this.input.attr === 'function' && this.input.attr('aria-label');
    this.autocompleteOptions.ariaLabel = this.autocompleteOptions.ariaLabel || inputAriaLabel || "search input";

    this.isSimpleLayout = layout === 'simple';

    this.client = (0, _lite2.default)(this.appId, this.apiKey);
    this.client.addAlgoliaAgent('docsearch.js ' + _version2.default);

    if (enhancedSearchInput) {
      this.input = DocSearch.injectSearchBox(this.input);
    }

    this.autocomplete = (0, _autocomplete2.default)(this.input, autocompleteOptions, [{
      source: this.getAutocompleteSource(transformData, queryHook),
      templates: {
        suggestion: DocSearch.getSuggestionTemplate(this.isSimpleLayout),
        footer: _templates2.default.footer,
        empty: DocSearch.getEmptyTemplate()
      }
    }]);

    var customHandleSelected = handleSelected;
    this.handleSelected = customHandleSelected || this.handleSelected;

    // We prevent default link clicking if a custom handleSelected is defined
    if (customHandleSelected) {
      (0, _zepto2.default)('.algolia-autocomplete').on('click', '.ds-suggestions a', function (event) {
        event.preventDefault();
      });
    }

    this.autocomplete.on('autocomplete:selected', this.handleSelected.bind(null, this.autocomplete.autocomplete));

    this.autocomplete.on('autocomplete:shown', this.handleShown.bind(null, this.input));

    if (enhancedSearchInput) {
      DocSearch.bindSearchBoxEvent();
    }
  }

  /**
   * Checks that the passed arguments are valid. Will throw errors otherwise
   * @function checkArguments
   * @param  {object} args Arguments as an option object
   * @returns {void}
   */


  _createClass(DocSearch, [{
    key: 'getAutocompleteSource',


    /**
     * Returns the `source` method to be passed to autocomplete.js. It will query
     * the Algolia index and call the callbacks with the formatted hits.
     * @function getAutocompleteSource
     * @param  {function} transformData An optional function to transform the hits
     * @param {function} queryHook An optional function to transform the query
     * @returns {function} Method to be passed as the `source` option of
     * autocomplete
     */
    value: function getAutocompleteSource(transformData, queryHook) {
      var _this = this;

      return function (query, callback) {
        if (queryHook) {
          // eslint-disable-next-line no-param-reassign
          query = queryHook(query) || query;
        }

        _this.client.search([{
          indexName: _this.indexName,
          query: query,
          params: _this.algoliaOptions
        }]).then(function (data) {
          if (_this.queryDataCallback && typeof _this.queryDataCallback == "function") {
            _this.queryDataCallback(data);
          }
          var hits = data.results[0].hits;
          if (transformData) {
            hits = transformData(hits) || hits;
          }
          callback(DocSearch.formatHits(hits));
        });
      };
    }

    // Given a list of hits returned by the API, will reformat them to be used in
    // a Hogan template

  }, {
    key: 'handleSelected',
    value: function handleSelected(input, event, suggestion, datasetNumber) {
      var context = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      // Do nothing if click on the suggestion, as it's already a <a href>, the
      // browser will take care of it. This allow Ctrl-Clicking on results and not
      // having the main window being redirected as well
      if (context.selectionMethod === 'click') {
        return;
      }

      input.setVal('');
      window.location.assign(suggestion.url);
    }
  }, {
    key: 'handleShown',
    value: function handleShown(input) {
      var middleOfInput = input.offset().left + input.width() / 2;
      var middleOfWindow = (0, _zepto2.default)(document).width() / 2;

      if (isNaN(middleOfWindow)) {
        middleOfWindow = 900;
      }

      var alignClass = middleOfInput - middleOfWindow >= 0 ? 'algolia-autocomplete-right' : 'algolia-autocomplete-left';
      var otherAlignClass = middleOfInput - middleOfWindow < 0 ? 'algolia-autocomplete-right' : 'algolia-autocomplete-left';
      var autocompleteWrapper = (0, _zepto2.default)('.algolia-autocomplete');
      if (!autocompleteWrapper.hasClass(alignClass)) {
        autocompleteWrapper.addClass(alignClass);
      }

      if (autocompleteWrapper.hasClass(otherAlignClass)) {
        autocompleteWrapper.removeClass(otherAlignClass);
      }
    }
  }], [{
    key: 'checkArguments',
    value: function checkArguments(args) {
      if (!args.apiKey || !args.indexName) {
        throw new Error(usage);
      }

      if (typeof args.inputSelector !== 'string') {
        throw new Error('Error: inputSelector:' + args.inputSelector + '  must be a string. Each selector must match only one element and separated by \',\'');
      }

      if (!DocSearch.getInputFromSelector(args.inputSelector)) {
        throw new Error('Error: No input element in the page matches ' + args.inputSelector);
      }
    }
  }, {
    key: 'injectSearchBox',
    value: function injectSearchBox(input) {
      input.before(_templates2.default.searchBox);
      var newInput = input.prev().prev().find('input');
      input.remove();
      return newInput;
    }
  }, {
    key: 'bindSearchBoxEvent',
    value: function bindSearchBoxEvent() {
      (0, _zepto2.default)('.searchbox [type="reset"]').on('click', function () {
        (0, _zepto2.default)('input#docsearch').focus();
        (0, _zepto2.default)(this).addClass('hide');
        _autocomplete2.default.autocomplete.setVal('');
      });

      (0, _zepto2.default)('input#docsearch').on('keyup', function () {
        var searchbox = document.querySelector('input#docsearch');
        var reset = document.querySelector('.searchbox [type="reset"]');
        reset.className = 'searchbox__reset';
        if (searchbox.value.length === 0) {
          reset.className += ' hide';
        }
      });
    }

    /**
     * Returns the matching input from a CSS selector, null if none matches
     * @function getInputFromSelector
     * @param  {string} selector CSS selector that matches the search
     * input of the page
     * @returns {void}
     */

  }, {
    key: 'getInputFromSelector',
    value: function getInputFromSelector(selector) {
      var input = (0, _zepto2.default)(selector).filter('input');
      return input.length ? (0, _zepto2.default)(input[0]) : null;
    }
  }, {
    key: 'formatHits',
    value: function formatHits(receivedHits) {
      var clonedHits = _utils2.default.deepClone(receivedHits);
      var hits = clonedHits.map(function (hit) {
        if (hit._highlightResult) {
          // eslint-disable-next-line no-param-reassign
          hit._highlightResult = _utils2.default.mergeKeyWithParent(hit._highlightResult, 'hierarchy');
        }
        return _utils2.default.mergeKeyWithParent(hit, 'hierarchy');
      });

      // Group hits by category / subcategory
      var groupedHits = _utils2.default.groupBy(hits, 'lvl0');
      _zepto2.default.each(groupedHits, function (level, collection) {
        var groupedHitsByLvl1 = _utils2.default.groupBy(collection, 'lvl1');
        var flattenedHits = _utils2.default.flattenAndFlagFirst(groupedHitsByLvl1, 'isSubCategoryHeader');
        groupedHits[level] = flattenedHits;
      });
      groupedHits = _utils2.default.flattenAndFlagFirst(groupedHits, 'isCategoryHeader');

      // Translate hits into smaller objects to be send to the template
      return groupedHits.map(function (hit) {
        var url = DocSearch.formatURL(hit);
        var category = _utils2.default.getHighlightedValue(hit, 'lvl0');
        var subcategory = _utils2.default.getHighlightedValue(hit, 'lvl1') || category;
        var displayTitle = _utils2.default.compact([_utils2.default.getHighlightedValue(hit, 'lvl2') || subcategory, _utils2.default.getHighlightedValue(hit, 'lvl3'), _utils2.default.getHighlightedValue(hit, 'lvl4'), _utils2.default.getHighlightedValue(hit, 'lvl5'), _utils2.default.getHighlightedValue(hit, 'lvl6')]).join('<span class="aa-suggestion-title-separator" aria-hidden="true"> › </span>');
        var text = _utils2.default.getSnippetedValue(hit, 'content');
        var isTextOrSubcategoryNonEmpty = subcategory && subcategory !== '' || displayTitle && displayTitle !== '';
        var isLvl1EmptyOrDuplicate = !subcategory || subcategory === '' || subcategory === category;
        var isLvl2 = displayTitle && displayTitle !== '' && displayTitle !== subcategory;
        var isLvl1 = !isLvl2 && subcategory && subcategory !== '' && subcategory !== category;
        var isLvl0 = !isLvl1 && !isLvl2;

        return {
          isLvl0: isLvl0,
          isLvl1: isLvl1,
          isLvl2: isLvl2,
          isLvl1EmptyOrDuplicate: isLvl1EmptyOrDuplicate,
          isCategoryHeader: hit.isCategoryHeader,
          isSubCategoryHeader: hit.isSubCategoryHeader,
          isTextOrSubcategoryNonEmpty: isTextOrSubcategoryNonEmpty,
          category: category,
          subcategory: subcategory,
          title: displayTitle,
          text: text,
          url: url
        };
      });
    }
  }, {
    key: 'formatURL',
    value: function formatURL(hit) {
      var url = hit.url,
          anchor = hit.anchor;

      if (url) {
        var containsAnchor = url.indexOf('#') !== -1;
        if (containsAnchor) return url;else if (anchor) return hit.url + '#' + hit.anchor;
        return url;
      } else if (anchor) return '#' + hit.anchor;
      /* eslint-disable */
      console.warn('no anchor nor url for : ', JSON.stringify(hit));
      /* eslint-enable */
      return null;
    }
  }, {
    key: 'getEmptyTemplate',
    value: function getEmptyTemplate() {
      return function (args) {
        return _hogan2.default.compile(_templates2.default.empty).render(args);
      };
    }
  }, {
    key: 'getSuggestionTemplate',
    value: function getSuggestionTemplate(isSimpleLayout) {
      var stringTemplate = isSimpleLayout ? _templates2.default.suggestionSimple : _templates2.default.suggestion;
      var template = _hogan2.default.compile(stringTemplate);
      return function (suggestion) {
        return template.render(suggestion);
      };
    }
  }]);

  return DocSearch;
}();

exports.default = DocSearch;