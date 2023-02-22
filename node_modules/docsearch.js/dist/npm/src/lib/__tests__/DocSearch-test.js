'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint no-new:0 */
/* eslint-disable max-len */


var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _zepto = require('../zepto');

var _zepto2 = _interopRequireDefault(_zepto);

var _DocSearch = require('../DocSearch');

var _DocSearch2 = _interopRequireDefault(_DocSearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Pitfalls:
 * Whenever you call new DocSearch(), it will add the a new dropdown markup to
 * the page. Because we are clearing the document.body.innerHTML between each
 * test, it usually is not a problem.
 * Except that autocomplete.js remembers internally how many times it has been
 * called, and adds this number to classes of elements it creates.
 * DO NOT rely on any .ds-dataset-X, .ds-suggestions-X, etc classes where X is
 * a number. This will change if you add or remove tests and will break your
 * tests.
 **/

describe('DocSearch', function () {
  beforeEach(function () {
    // Note: If you edit this HTML while doing TDD with `npm run test:watch`,
    // you will have to restart `npm run test:watch` for the new HTML to be
    // updated
    document.body.innerHTML = '\n    <div>\n      <input id="input" name="search" />\n      <span class="i-am-a-span">span span</span>\n    </div>\n    ';

    // We prevent the logging of expected errors
    window.console.warn = _sinon2.default.spy();

    window.location.assign = jest.fn();
  });

  describe('constructor', function () {
    var AlgoliaSearch = void 0;
    var algoliasearch = void 0;
    var AutoComplete = void 0;
    var autocomplete = void 0;
    var defaultOptions = void 0;

    beforeEach(function () {
      algoliasearch = {
        algolia: 'client',
        addAlgoliaAgent: _sinon2.default.spy()
      };
      AlgoliaSearch = _sinon2.default.stub().returns(algoliasearch);
      autocomplete = {
        on: _sinon2.default.spy()
      };
      AutoComplete = _sinon2.default.stub().returns(autocomplete);
      defaultOptions = {
        indexName: 'indexName',
        apiKey: 'apiKey',
        inputSelector: '#input'
      };

      _sinon2.default.spy(_DocSearch2.default, 'checkArguments');
      _sinon2.default.stub(_DocSearch2.default, 'getInputFromSelector').returns(true);

      _DocSearch2.default.__Rewire__('algoliasearch', AlgoliaSearch);
      _DocSearch2.default.__Rewire__('autocomplete', AutoComplete);
    });

    afterEach(function () {
      _DocSearch2.default.checkArguments.restore();
      _DocSearch2.default.getInputFromSelector.restore();
      _DocSearch2.default.__ResetDependency__('algoliasearch');
      _DocSearch2.default.__ResetDependency__('autocomplete');
    });

    it('should call checkArguments', function () {
      // Given
      var options = defaultOptions;

      // When
      new _DocSearch2.default(options);

      // Then
      expect(_DocSearch2.default.checkArguments.calledOnce).toBe(true);
    });
    it('should pass main options as instance properties', function () {
      // Given
      var options = defaultOptions;

      // When
      var actual = new _DocSearch2.default(options);

      // Then
      expect(actual.indexName).toEqual('indexName');
      expect(actual.apiKey).toEqual('apiKey');
    });
    it('should set docsearch App Id as default', function () {
      // Given
      var options = defaultOptions;

      // When
      var actual = new _DocSearch2.default(options);

      // Then
      expect(actual.appId).toEqual('BH4D9OD16A');
    });
    it('should allow overriding appId', function () {
      // Given
      var options = _extends({}, defaultOptions, { appId: 'foo' });

      // When
      var actual = new _DocSearch2.default(options);

      // Then
      expect(actual.appId).toEqual('foo');
    });
    it('should allow customize algoliaOptions without loosing default options', function () {
      // Given
      var options = _extends({
        algoliaOptions: {
          facetFilters: ['version:1.0']
        }
      }, defaultOptions);

      // When
      var actual = new _DocSearch2.default(options);

      // Then
      expect(actual.algoliaOptions).toEqual({
        hitsPerPage: 5,
        facetFilters: ['version:1.0']
      });
    });
    it('should allow customize hitsPerPage', function () {
      // Given
      var options = _extends({
        algoliaOptions: {
          hitsPerPage: 10
        }
      }, defaultOptions);

      // When
      var actual = new _DocSearch2.default(options);

      // Then
      expect(actual.algoliaOptions).toEqual({ hitsPerPage: 10 });
    });
    it('should pass the input element as an instance property', function () {
      // Given
      var options = defaultOptions;
      _DocSearch2.default.getInputFromSelector.returns((0, _zepto2.default)('<span>foo</span>'));

      // When
      var actual = new _DocSearch2.default(options);

      // Then
      var $inputs = actual.input;
      expect($inputs.text()).toEqual('foo');
      expect($inputs[0].tagName).toEqual('SPAN');
    });
    it('should pass secondary options as instance properties', function () {
      // Given
      var options = _extends({}, defaultOptions, {
        algoliaOptions: { anOption: 42 },
        autocompleteOptions: { anOption: 44 }
      });

      // When
      var actual = new _DocSearch2.default(options);

      // Then
      expect(_typeof(actual.algoliaOptions)).toEqual('object');
      expect(actual.algoliaOptions.anOption).toEqual(42);
      expect(actual.autocompleteOptions).toEqual({
        debug: false,
        cssClasses: { prefix: 'ds' },
        anOption: 44,
        ariaLabel: 'search input'
      });
    });
    it('should instantiate algoliasearch with the correct values', function () {
      // Given
      var options = defaultOptions;

      // When
      new _DocSearch2.default(options);

      // Then
      expect(AlgoliaSearch.calledOnce).toBe(true);
      expect(AlgoliaSearch.calledWith('BH4D9OD16A', 'apiKey')).toBe(true);
    });
    it('should set a custom User-Agent to algoliasearch', function () {
      // Given
      var options = defaultOptions;

      // When
      new _DocSearch2.default(options);

      // Then
      expect(algoliasearch.addAlgoliaAgent.calledOnce).toBe(true);
    });
    it('should instantiate autocomplete.js', function () {
      // Given
      var options = _extends({}, defaultOptions, {
        autocompleteOptions: { anOption: '44' }
      });
      var $input = (0, _zepto2.default)('<input name="foo" />');
      _DocSearch2.default.getInputFromSelector.returns($input);

      // When
      new _DocSearch2.default(options);

      // Then
      expect(AutoComplete.calledOnce).toBe(true);
      expect(AutoComplete.calledWith($input, {
        anOption: '44',
        cssClasses: { prefix: 'ds' },
        debug: false,
        ariaLabel: 'search input'
      })).toBe(true);
    });
    it('should listen to the selected and shown event of autocomplete', function () {
      // Given
      var options = _extends({}, defaultOptions, {
        handleSelected: function handleSelected() {}
      });

      // When
      new _DocSearch2.default(options);

      // Then
      expect(autocomplete.on.calledTwice).toBe(true);
      expect(autocomplete.on.calledWith('autocomplete:selected')).toBe(true);
    });
  });

  describe('checkArguments', function () {
    var checkArguments = void 0;
    beforeEach(function () {
      checkArguments = _DocSearch2.default.checkArguments;
    });

    afterEach(function () {
      if (_DocSearch2.default.getInputFromSelector.restore) {
        _DocSearch2.default.getInputFromSelector.restore();
      }
    });

    it('should throw an error if no apiKey defined', function () {
      // Given
      var options = {
        indexName: 'indexName'
      };

      // When
      expect(function () {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if no indexName defined', function () {
      // Given
      var options = {
        apiKey: 'apiKey'
      };

      // When
      expect(function () {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if no selector matches', function () {
      // Given
      var options = {
        apiKey: 'apiKey',
        indexName: 'indexName'
      };
      _sinon2.default.stub(_DocSearch2.default, 'getInputFromSelector').returns(false);

      // When
      expect(function () {
        checkArguments(options);
      }).toThrow(/^Error:/);
    });
  });

  describe('getInputFromSelector', function () {
    var getInputFromSelector = void 0;
    beforeEach(function () {
      getInputFromSelector = _DocSearch2.default.getInputFromSelector;
    });

    it('should return null if no element matches the selector', function () {
      // Given
      var selector = '.i-do-not-exist > at #all';

      // When
      var actual = getInputFromSelector(selector);

      // Then
      expect(actual).toEqual(null);
    });
    it('should return null if the matched element is not an input', function () {
      // Given
      var selector = '.i-am-a-span';

      // When
      var actual = getInputFromSelector(selector);

      // Then
      expect(actual).toEqual(null);
    });
    it('should return a Zepto wrapped element if it matches', function () {
      // Given
      var selector = '#input';

      // When
      var actual = getInputFromSelector(selector);

      // Then
      expect(_zepto2.default.zepto.isZ(actual)).toBe(true);
    });
  });

  describe('getAutocompleteSource', function () {
    var client = void 0;
    var AlgoliaSearch = void 0;
    var docsearch = void 0;
    beforeEach(function () {
      client = {
        algolia: 'client',
        addAlgoliaAgent: _sinon2.default.spy(),
        search: _sinon2.default.stub().returns({
          then: _sinon2.default.spy()
        })
      };
      AlgoliaSearch = _sinon2.default.stub().returns(client);
      _DocSearch2.default.__Rewire__('algoliasearch', AlgoliaSearch);

      docsearch = new _DocSearch2.default({
        indexName: 'indexName',
        apiKey: 'apiKey',
        inputSelector: '#input'
      });
    });

    afterEach(function () {
      _DocSearch2.default.__ResetDependency__('algoliasearch');
    });

    it('returns a function', function () {
      // Given
      var actual = docsearch.getAutocompleteSource();

      // When

      // Then
      expect(actual).toBeInstanceOf(Function);
    });

    describe('the returned function', function () {
      it('calls the Algolia client with the correct parameters', function () {
        // Given
        var actual = docsearch.getAutocompleteSource();

        // When
        actual('query');

        // Then
        expect(client.search.calledOnce).toBe(true);
        // expect(resolvedQuery.calledOnce).toBe(true);
        var expectedArguments = {
          indexName: 'indexName',
          query: 'query',
          params: { hitsPerPage: 5 }
        };
        expect(client.search.calledWith([expectedArguments])).toBe(true);
      });
    });

    describe('when queryHook is used', function () {
      it('calls the Algolia client with the correct parameters', function () {
        // Given
        var actual = docsearch.getAutocompleteSource(false, function (query) {
          return query + ' modified';
        });

        // When
        actual('query');

        // Then
        expect(client.search.calledOnce).toBe(true);
        // expect(resolvedQuery.calledOnce).toBe(true);
        var expectedArguments = {
          indexName: 'indexName',
          query: 'query modified',
          params: { hitsPerPage: 5 }
        };
        expect(client.search.calledWith([expectedArguments])).toBe(true);
      });
    });
  });

  describe('handleSelected', function () {
    it('should change the location if no handleSelected specified', function () {
      // Given
      var options = {
        apiKey: 'key',
        indexName: 'foo',
        inputSelector: '#input'
      };

      // When
      var ds = new _DocSearch2.default(options);
      ds.autocomplete.trigger('autocomplete:selected', {
        url: 'https://website.com/doc/page'
      });

      return new Promise(function (resolve) {
        expect(window.location.assign).toHaveBeenCalledWith('https://website.com/doc/page');
        resolve();
      });
    });
    it('should call the custom handleSelected if defined', function () {
      // Given
      var customHandleSelected = jest.fn();
      var options = {
        apiKey: 'key',
        indexName: 'foo',
        inputSelector: '#input',
        handleSelected: customHandleSelected
      };
      var expectedInput = expect.objectContaining({
        open: expect.any(Function)
      });
      var expectedEvent = expect.objectContaining({
        type: 'autocomplete:selected'
      });
      var expectedSuggestion = expect.objectContaining({
        url: 'https://website.com/doc/page'
      });

      // When
      var ds = new _DocSearch2.default(options);
      ds.autocomplete.trigger('autocomplete:selected', {
        url: 'https://website.com/doc/page'
      });

      return new Promise(function (resolve) {
        expect(customHandleSelected).toHaveBeenCalledWith(expectedInput, expectedEvent, expectedSuggestion);
        resolve();
      });
    });
    it('should prevent all clicks on links if a custom handleSelected is specified', function () {
      // Given
      var options = {
        apiKey: 'key',
        indexName: 'foo',
        inputSelector: '#input',
        handleSelected: jest.fn()
      };

      // Building a dropdown with links inside
      var ds = new _DocSearch2.default(options);
      ds.autocomplete.trigger('autocomplete:shown');
      var dataset = (0, _zepto2.default)('.algolia-autocomplete');
      var suggestions = (0, _zepto2.default)('<div class="ds-suggestions"></div>');
      var testLink = (0, _zepto2.default)('<a href="#">test link</a>');
      dataset.append(suggestions);
      suggestions.append(testLink);

      // Simulating a click on the link
      var clickEvent = new _zepto2.default.Event('click');
      clickEvent.preventDefault = jest.fn();
      testLink.trigger(clickEvent);

      return new Promise(function (resolve) {
        expect(clickEvent.preventDefault).toHaveBeenCalled();
        resolve();
      });
    });
    describe('default handleSelected', function () {
      it('enterKey: should change the page', function () {
        var options = {
          apiKey: 'key',
          indexName: 'foo',
          inputSelector: '#input'
        };
        var mockSetVal = jest.fn();
        var mockInput = { setVal: mockSetVal };
        var mockSuggestion = { url: 'www.example.com' };
        var mockContext = { selectionMethod: 'enterKey' };

        new _DocSearch2.default(options).handleSelected(mockInput, undefined, // Event
        mockSuggestion, undefined, // Dataset
        mockContext);

        return new Promise(function (resolve) {
          expect(mockSetVal).toHaveBeenCalledWith('');
          expect(window.location.assign).toHaveBeenCalledWith('www.example.com');
          resolve();
        });
      });
      it('click: should not change the page', function () {
        var options = {
          apiKey: 'key',
          indexName: 'foo',
          inputSelector: '#input'
        };
        var mockSetVal = jest.fn();
        var mockInput = { setVal: mockSetVal };
        var mockContext = { selectionMethod: 'click' };

        new _DocSearch2.default(options).handleSelected(mockInput, undefined, // Event
        undefined, // Suggestion
        undefined, // Dataset
        mockContext);

        return new Promise(function (resolve) {
          expect(mockSetVal).not.toHaveBeenCalled();
          expect(window.location.assign).not.toHaveBeenCalled();
          resolve();
        });
      });
    });
  });

  describe('handleShown', function () {
    it('should add an alignment class', function () {
      // Given
      var options = {
        apiKey: 'key',
        indexName: 'foo',
        inputSelector: '#input'
      };

      // When
      var ds = new _DocSearch2.default(options);

      ds.autocomplete.trigger('autocomplete:shown');

      expect((0, _zepto2.default)('.algolia-autocomplete').attr('class')).toEqual('algolia-autocomplete algolia-autocomplete-right');
    });
  });

  describe('formatHits', function () {
    it('should not mutate the input', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(input).not.toBe(actual);
    });
    it('should set category headers to the first of each category', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'Geo-search',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Python',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].isCategoryHeader).toEqual(true);
      expect(actual[2].isCategoryHeader).toEqual(true);
    });
    it('should group items of same category together', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Python',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'Geo-search',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].category).toEqual('Ruby');
      expect(actual[1].category).toEqual('Ruby');
      expect(actual[2].category).toEqual('Python');
    });
    it('should mark all first elements as subcategories', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Python',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'Geo-search',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].isSubCategoryHeader).toEqual(true);
      expect(actual[2].isSubCategoryHeader).toEqual(true);
    });
    it('should mark new subcategories as such', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Foo',
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Python',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Bar',
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }, {
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'Geo-search',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].isSubCategoryHeader).toEqual(true);
      expect(actual[1].isSubCategoryHeader).toEqual(false);
      expect(actual[2].isSubCategoryHeader).toEqual(true);
      expect(actual[3].isSubCategoryHeader).toEqual(true);
    });
    it('should use highlighted category and subcategory if exists', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Foo',
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        _highlightResult: {
          hierarchy: {
            lvl0: {
              value: '<mark>Ruby</mark>'
            },
            lvl1: {
              value: '<mark>API</mark>'
            }
          }
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].category).toEqual('<mark>Ruby</mark>');
      expect(actual[0].subcategory).toEqual('<mark>API</mark>');
    });

    it('should use highlighted camel if exists and matchLevel not none', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Foo',
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        _highlightResult: {
          // eslint-disable-next-line camelcase
          hierarchy_camel: {
            lvl0: {
              value: '<mark>Python</mark>',
              matchLevel: 'full'
            },
            lvl1: {
              value: '<mark>API2</mark>',
              matchLevel: 'full'
            }
          },
          hierarchy: {
            lvl0: {
              value: '<mark>Ruby</mark>'
            },
            lvl1: {
              value: '<mark>API</mark>'
            }
          }
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].category).toEqual('<mark>Python</mark>');
      expect(actual[0].subcategory).toEqual('<mark>API2</mark>');
    });
    it('should use lvl2 as title', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Foo',
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].title).toEqual('Foo');
    });
    it('should use lvl1 as title if no lvl2', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].title).toEqual('API');
    });
    it('should use lvl0 as title if no lvl2 nor lvl2', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: null,
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].title).toEqual('Ruby');
    });
    it('should concatenate lvl2+ for title if more', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Geo-search',
          lvl3: 'Foo',
          lvl4: 'Bar',
          lvl5: 'Baz'
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      var separator = '<span class="aa-suggestion-title-separator" aria-hidden="true"> › </span>';
      // Then
      expect(actual[0].title).toEqual('Geo-search' + separator + 'Foo' + separator + 'Bar' + separator + 'Baz');
    });
    it('should concatenate highlighted elements', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: 'Geo-search',
          lvl3: 'Foo',
          lvl4: 'Bar',
          lvl5: 'Baz'
        },
        _highlightResult: {
          hierarchy: {
            lvl0: {
              value: '<mark>Ruby</mark>'
            },
            lvl1: {
              value: '<mark>API</mark>'
            },
            lvl2: {
              value: '<mark>Geo-search</mark>'
            },
            lvl3: {
              value: '<mark>Foo</mark>'
            },
            lvl4: {
              value: '<mark>Bar</mark>'
            },
            lvl5: {
              value: '<mark>Baz</mark>'
            }
          }
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      var separator = '<span class="aa-suggestion-title-separator" aria-hidden="true"> › </span>';
      // Then
      var expected = '<mark>Geo-search</mark>' + separator + '<mark>Foo</mark>' + separator + '<mark>Bar</mark>' + separator + '<mark>Baz</mark>';
      expect(actual[0].title).toEqual(expected);
    });
    it('should add ellipsis to content', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        content: 'foo bar',
        _snippetResult: {
          content: {
            value: 'lorem <mark>foo</mark> bar ipsum.'
          }
        }
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].text).toEqual('…lorem <mark>foo</mark> bar ipsum.');
    });
    it('should add the anchor to the url if one is set', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        content: 'foo bar',
        url: 'http://foo.bar/',
        anchor: 'anchor'
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].url).toEqual('http://foo.bar/#anchor');
    });
    it('should not add the anchor to the url if one is set but it is already in the URL', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        content: 'foo bar',
        url: 'http://foo.bar/#anchor',
        anchor: 'anchor'
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].url).toEqual('http://foo.bar/#anchor');
    });
    it('should just use the URL if no anchor is provided', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        content: 'foo bar',
        url: 'http://foo.bar/'
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].url).toEqual(input[0].url);
    });
    it('should return the anchor if there is no URL', function () {
      // Given
      var input = [{
        hierarchy: {
          lvl0: 'Ruby',
          lvl1: 'API',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null
        },
        content: 'foo bar',
        anchor: 'anchor'
      }];

      // When
      var actual = _DocSearch2.default.formatHits(input);

      // Then
      expect(actual[0].url).toEqual('#' + input[0].anchor);
    });
  });

  describe('formatUrl', function () {
    it('concatenates url and anchor', function () {
      // Given
      var input = {
        url: 'url',
        anchor: 'anchor'
      };

      // When
      var actual = _DocSearch2.default.formatURL(input);

      // Then
      expect(actual).toEqual('url#anchor');
    });

    it('returns only the url if no anchor', function () {
      // Given
      var input = {
        url: 'url'
      };

      // When
      var actual = _DocSearch2.default.formatURL(input);

      // Then
      expect(actual).toEqual('url');
    });

    it('returns the anchor if no url', function () {
      // Given
      var input = {
        anchor: 'anchor'
      };

      // When
      var actual = _DocSearch2.default.formatURL(input);

      // Then
      expect(actual).toEqual('#anchor');
    });

    it('does not concatenate if already an anchor', function () {
      // Given
      var input = {
        url: 'url#anchor',
        anchor: 'anotheranchor'
      };

      // When
      var actual = _DocSearch2.default.formatURL(input);

      // Then
      expect(actual).toEqual('url#anchor');
    });

    it('returns null if no anchor nor url', function () {
      // Given
      var input = {};

      // When
      var actual = _DocSearch2.default.formatURL(input);

      // Then
      expect(actual).toEqual(null);
    });

    it('emits a warning if no anchor nor url', function () {
      // Given
      var input = {};

      // When
      _DocSearch2.default.formatURL(input);

      // Then
      expect(window.console.warn.calledOnce).toBe(true);
    });
  });

  describe('getSuggestionTemplate', function () {
    beforeEach(function () {
      var templates = {
        suggestion: '<div></div>'
      };
      _DocSearch2.default.__Rewire__('templates', templates);
    });
    afterEach(function () {
      _DocSearch2.default.__ResetDependency__('templates');
    });
    it('should return a function', function () {
      // Given

      // When
      var actual = _DocSearch2.default.getSuggestionTemplate();

      // Then
      expect(actual).toBeInstanceOf(Function);
    });
    describe('returned function', function () {
      var Hogan = void 0;
      var render = void 0;
      beforeEach(function () {
        render = _sinon2.default.spy();
        Hogan = {
          compile: _sinon2.default.stub().returns({ render: render })
        };
        _DocSearch2.default.__Rewire__('Hogan', Hogan);
      });
      it('should compile the suggestion template', function () {
        // Given

        // When
        _DocSearch2.default.getSuggestionTemplate();

        // Then
        expect(Hogan.compile.calledOnce).toBe(true);
        expect(Hogan.compile.calledWith('<div></div>')).toBe(true);
      });
      it('should call render on a Hogan template', function () {
        // Given
        var actual = _DocSearch2.default.getSuggestionTemplate();

        // When
        actual({ foo: 'bar' });

        // Then
        expect(render.calledOnce).toBe(true);
        expect(render.args[0][0]).toEqual({ foo: 'bar' });
      });
    });
  });
});