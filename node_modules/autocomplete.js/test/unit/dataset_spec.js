'use strict';

/* eslint-env mocha, jasmine */


describe('Dataset', function() {
  require('../../src/common/dom.js').element = require('jquery');
  require('../../src/jquery/plugin.js');

  var $ = require('jquery');
  require('jasmine-jquery');

  var Dataset = require('../../src/autocomplete/dataset.js');

  beforeEach(function() {
    this.dataset = new Dataset({
      name: 'test',
      source: this.source = jasmine.createSpy('source')
    });
  });

  it('should throw an error if source is missing', function() {
    expect(noSource).toThrow();

    function noSource() {
      new Dataset();
    }
  });

  it('should throw an error if the name is not a valid class name', function() {
    expect(fn).toThrow();

    function fn() {
      var d = new Dataset({name: 'a space', source: $.noop});
    }
  });

  describe('#getRoot', function() {
    it('should return the root element', function() {
      expect(this.dataset.getRoot()).toBeMatchedBy('div.aa-dataset-test');
    });
  });

  describe('#update', function() {
    it('should render suggestions', function() {
      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).toContainText('one');
      expect(this.dataset.getRoot()).toContainText('two');
      expect(this.dataset.getRoot()).toContainText('three');
    });

    it('should allow custom display functions', function() {
      this.dataset = new Dataset({
        name: 'test',
        display: function(o) { return o.display; },
        source: this.source = jasmine.createSpy('source')
      });

      this.source.and.callFake(fakeGetForDisplayFn);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).toContainText('4');
      expect(this.dataset.getRoot()).toContainText('5');
      expect(this.dataset.getRoot()).toContainText('6');
    });

    it('should render empty when no suggestions are available', function() {
      this.dataset = new Dataset({
        source: this.source,
        templates: {
          empty: '<h2>empty</h2>'
        }
      });

      this.source.and.callFake(fakeGetWithSyncEmptyResults);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).toContainText('empty');
    });

    it('should throw an error if suggestions is not an array', function() {
      this.source.and.callFake(fakeGetWithSyncNonArrayResults);
      expect(this.dataset.update.bind(this.dataset, 'woah'))
        .toThrowError(TypeError, 'suggestions must be an array');
    });

    it('should set the aa-without class when no suggestions are available', function() {
      var $menu = $('<div />');
      this.dataset = new Dataset({
        $menu: $menu,
        source: this.source,
        templates: {
          empty: '<h2>empty</h2>'
        }
      });

      this.source.and.callFake(fakeGetWithSyncEmptyResults);
      this.dataset.update('woah');

      expect($menu).toHaveClass('aa-without-1');
      expect($menu).not.toHaveClass('aa-with-1');
    });

    it('should set the aa-with class when suggestions are available', function() {
      var $menu = $('<div />');
      this.dataset = new Dataset({
        $menu: $menu,
        name: 'fake',
        source: this.source,
        templates: {
          empty: '<h2>empty</h2>'
        }
      });

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      expect($menu).not.toHaveClass('aa-without-fake');
      expect($menu).toHaveClass('aa-with-fake');
    });

    it('should allow dataset name=0 and use the provided div', function() {
      var $menu = $('<div><div class="predefined aa-dataset-0"></div></div>');
      this.dataset = new Dataset({
        $menu: $menu,
        name: 0,
        source: this.source
      });
      expect(this.dataset.$el).toHaveClass('predefined');
    });

    it('should render isEmpty with extra params', function() {
      var spy = jasmine.createSpy('empty with extra params');
      this.dataset = new Dataset({
        source: this.source,
        templates: {
          empty: spy
        }
      });

      this.source.and.callFake(fakeGetWithSyncEmptyResultsAndExtraParams);
      this.dataset.update('woah');

      expect(spy).toHaveBeenCalled();
      expect(spy.calls.argsFor(0).length).toEqual(4);
      expect(spy.calls.argsFor(0)[0]).toEqual({query: 'woah', isEmpty: true});
      expect(spy.calls.argsFor(0)[1]).toEqual(42);
      expect(spy.calls.argsFor(0)[2]).toEqual(true);
      expect(spy.calls.argsFor(0)[3]).toEqual(false);
    });

    it('should render with extra params', function() {
      var headerSpy = jasmine.createSpy('header with extra params');
      var footerSpy = jasmine.createSpy('footer with extra params');
      var suggestionSpy = jasmine.createSpy('suggestion with extra params');
      this.dataset = new Dataset({
        source: this.source,
        templates: {
          header: headerSpy,
          footer: footerSpy,
          suggestion: suggestionSpy
        }
      });

      var suggestions;
      fakeGetWithSyncResultsAndExtraParams('woah', function(all) {
        suggestions = all;
      });

      this.source.and.callFake(fakeGetWithSyncResultsAndExtraParams);
      this.dataset.update('woah');

      expect(headerSpy).toHaveBeenCalled();
      expect(headerSpy.calls.argsFor(0).length).toEqual(4);
      expect(headerSpy.calls.argsFor(0)[0]).toEqual({query: 'woah', isEmpty: false});
      expect(headerSpy.calls.argsFor(0)[1]).toEqual(42);
      expect(headerSpy.calls.argsFor(0)[2]).toEqual(true);
      expect(headerSpy.calls.argsFor(0)[3]).toEqual(false);

      expect(footerSpy).toHaveBeenCalled();
      expect(footerSpy.calls.argsFor(0).length).toEqual(4);
      expect(footerSpy.calls.argsFor(0)[0]).toEqual({query: 'woah', isEmpty: false});
      expect(footerSpy.calls.argsFor(0)[1]).toEqual(42);
      expect(footerSpy.calls.argsFor(0)[2]).toEqual(true);
      expect(footerSpy.calls.argsFor(0)[3]).toEqual(false);

      expect(suggestionSpy).toHaveBeenCalled();
      for (var i = 0; i < 2; ++i) {
        expect(suggestionSpy.calls.argsFor(i).length).toEqual(4);
        expect(suggestionSpy.calls.argsFor(i)[0]).toEqual(suggestions[i]);
        expect(suggestionSpy.calls.argsFor(i)[1]).toEqual(42);
        expect(suggestionSpy.calls.argsFor(i)[2]).toEqual(true);
        expect(suggestionSpy.calls.argsFor(i)[3]).toEqual(false);
      }
    });

    it('should render header', function() {
      this.dataset = new Dataset({
        source: this.source,
        templates: {
          header: '<h2>header</h2>'
        }
      });

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).toContainText('header');
    });

    it('should render footer', function() {
      this.dataset = new Dataset({
        source: this.source,
        templates: {
          footer: function(c) { return '<p>' + c.query + '</p>'; }
        }
      });

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).toContainText('woah');
    });

    it('should not render header/footer if there is no content', function() {
      this.dataset = new Dataset({
        source: this.source,
        templates: {
          header: '<h2>header</h2>',
          footer: '<h2>footer</h2>'
        }
      });

      this.source.and.callFake(fakeGetWithSyncEmptyResults);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).not.toContainText('header');
      expect(this.dataset.getRoot()).not.toContainText('footer');
    });

    it('should not render stale suggestions', function(done) {
      this.source.and.callFake(fakeGetWithAsyncResults);
      this.dataset.update('woah');

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('nelly');

      var that = this;
      setTimeout(function() {
        expect(that.dataset.getRoot()).toContainText('one');
        expect(that.dataset.getRoot()).toContainText('two');
        expect(that.dataset.getRoot()).toContainText('three');
        expect(that.dataset.getRoot()).not.toContainText('four');
        expect(that.dataset.getRoot()).not.toContainText('five');
        done();
      }, 100);
    });

    it('should not render suggestions if update was canceled', function(done) {
      this.source.and.callFake(fakeGetWithAsyncResults);
      this.dataset.update('woah');
      this.dataset.cancel();

      var that = this;
      setTimeout(function() {
        expect(that.dataset.getRoot()).toBeEmpty();
        done();
      }, 100);
    });

    it('should trigger rendered after suggestions are rendered', function(done) {
      var spy;

      this.dataset.onSync('rendered', spy = jasmine.createSpy());

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      setTimeout(function() {
        expect(spy.calls.count()).toBe(1);
        done();
      }, 100);
    });

    it('should cache latest query, suggestions and extra render arguments', function() {
      this.source.and.callFake(fakeGetWithSyncResultsAndExtraParams);
      this.dataset.update('woah');

      expect(this.dataset.cachedQuery).toEqual('woah');
      expect(this.dataset.cachedSuggestions).toEqual([
        {value: 'one', raw: {value: 'one'}},
        {value: 'two', raw: {value: 'two'}},
        {value: 'three', raw: {value: 'three'}}
      ]);
      expect(this.dataset.cachedRenderExtraArgs).toEqual([42, true, false]);
    });

    it('should retrieve cached results for subsequent identical queries', function() {
      this.source.and.callFake(fakeGetWithSyncResults);

      this.dataset.update('woah');
      expect(this.source.calls.count()).toBe(1);
      expect(this.dataset.getRoot()).toContainText('one');
      expect(this.dataset.getRoot()).toContainText('two');
      expect(this.dataset.getRoot()).toContainText('three');

      this.dataset.clear();
      this.dataset.update('woah');
      expect(this.source.calls.count()).toBe(1);
      expect(this.dataset.getRoot()).toContainText('one');
      expect(this.dataset.getRoot()).toContainText('two');
      expect(this.dataset.getRoot()).toContainText('three');
    });

    it('should not retrieve cached results for subsequent identical queries if cache is disabled', function() {
      this.dataset = new Dataset({
        name: 'test',
        source: this.source = jasmine.createSpy('source'),
        cache: false,
      });

      this.source.and.callFake(fakeGetWithSyncResultsAndExtraParams);

      this.dataset.update('woah');
      expect(this.source.calls.count()).toBe(1);
      expect(this.dataset.getRoot()).toContainText('one');
      expect(this.dataset.getRoot()).toContainText('two');
      expect(this.dataset.getRoot()).toContainText('three');

      this.dataset.clear();
      this.dataset.update('woah');
      expect(this.source.calls.count()).toBe(2);
      expect(this.dataset.getRoot()).toContainText('one');
      expect(this.dataset.getRoot()).toContainText('two');
      expect(this.dataset.getRoot()).toContainText('three');
    });

    it('should reuse render function extra params for subsequent identical queries', function() {
      var spy = spyOn(this.dataset, '_render');
      this.source.and.callFake(fakeGetWithSyncResultsAndExtraParams);

      this.dataset.update('woah');
      expect(this.source.calls.count()).toBe(1);
      expect(spy.calls.argsFor(0)).toEqual([
        'woah', [
        {value: 'one', raw: {value: 'one'}},
        {value: 'two', raw: {value: 'two'}},
        {value: 'three', raw: {value: 'three'}}
      ], 42, true, false]);

      this.dataset.clear();
      this.dataset.update('woah');
      expect(this.source.calls.count()).toBe(1);
      expect(spy.calls.argsFor(1)).toEqual([
        'woah', [
        {value: 'one', raw: {value: 'one'}},
        {value: 'two', raw: {value: 'two'}},
        {value: 'three', raw: {value: 'three'}}
      ], 42, true, false]);
    });

    it('should not retrieved cached results for subsequent different queries', function() {
      this.source.and.callFake(fakeGetWithSyncResultsAndExtraParams);

      this.dataset.update('woah');
      expect(this.source.calls.count()).toBe(1);

      this.dataset.clear();
      this.dataset.update('woah 2');
      expect(this.source.calls.count()).toBe(2);
    });

    it('should wait before calling the source if debounce is provided', function(done) {
      var that = this;

      this.dataset = new Dataset({
        source: this.source,
        debounce: 250
      });

      this.source.and.callFake(fakeGetWithSyncResultsAndExtraParams);

      this.dataset.update('woah');
      expect(this.source.calls.count()).toBe(0);

      this.dataset.update('woah 2');
      expect(this.source.calls.count()).toBe(0);

      setTimeout(function() {
        expect(that.source.calls.count()).toBe(1);
        done();
      }, 500);
    });

    it('should not call the source if update was canceled', function(done) {
      var that = this;

      this.dataset = new Dataset({
        source: this.source,
        debounce: 250
      });

      this.source.and.callFake(fakeGetWithSyncResultsAndExtraParams);

      this.dataset.update('woah');
      expect(this.source.calls.count()).toBe(0);

      this.dataset.update('woah 2');
      expect(this.source.calls.count()).toBe(0);

      this.dataset.clear();
      expect(this.source.calls.count()).toBe(0);

      setTimeout(function() {
        expect(that.source.calls.count()).toBe(0);
        done();
      }, 500);
    });
  });

  describe('#cacheSuggestions', function() {
    it('should assign cachedQuery, cachedSuggestions and cachedRenderArgs properties', function() {
      this.dataset.cacheSuggestions('woah', ['one', 'two'], 42);
      expect(this.dataset.cachedQuery).toEqual('woah');
      expect(this.dataset.cachedSuggestions).toEqual(['one', 'two']);
      expect(this.dataset.cachedRenderExtraArgs).toEqual(42);
    });
  });

  describe('#clearCachedSuggestions', function() {
    it('should delete cachedQuery and cachedSuggestions properties', function() {
      this.dataset.cachedQuery = 'one';
      this.dataset.cachedSuggestions = ['one', 'two'];
      this.dataset.cachedRenderExtraArgs = 42;

      this.dataset.clearCachedSuggestions();

      expect(this.dataset.cachedQuery).toBeUndefined();
      expect(this.dataset.cachedSuggestions).toBeUndefined();
      expect(this.dataset.cachedRenderExtraArgs).toBeUndefined();
    });
  });

  describe('#clear', function() {
    it('should clear suggestions', function() {
      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      this.dataset.clear();
      expect(this.dataset.getRoot()).toBeEmpty();
    });

    it('should cancel pending updates', function() {
      var spy = spyOn(this.dataset, 'cancel');

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');
      expect(this.dataset.canceled).toBe(false);

      this.dataset.clear();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#isEmpty', function() {
    it('should return true when empty', function() {
      expect(this.dataset.isEmpty()).toBe(true);
    });

    it('should return false when not empty', function() {
      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      expect(this.dataset.isEmpty()).toBe(false);
    });
  });

  describe('#destroy', function() {
    it('should null out the reference to the dataset element', function() {
      this.dataset.destroy();

      expect(this.dataset.$el).toBeNull();
    });

    it('should clear suggestion cache', function() {
      var spy = spyOn(this.dataset, 'clearCachedSuggestions');
      this.dataset.destroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  // helper functions
  // ----------------

  function fakeGetWithSyncResults(query, cb) {
    cb([
      {value: 'one', raw: {value: 'one'}},
      {value: 'two', raw: {value: 'two'}},
      {value: 'three', raw: {value: 'three'}}
    ]);
  }

  function fakeGetForDisplayFn(query, cb) {
    cb([{display: '4'}, {display: '5'}, {display: '6'}]);
  }

  function fakeGetWithSyncNonArrayResults(query, cb) {
    cb({});
  }

  function fakeGetWithSyncEmptyResults(query, cb) {
    cb();
  }

  function fakeGetWithSyncEmptyResultsAndExtraParams(query, cb) {
    cb([], 42, true, false);
  }

  function fakeGetWithSyncResultsAndExtraParams(query, cb) {
    cb([
      {value: 'one', raw: {value: 'one'}},
      {value: 'two', raw: {value: 'two'}},
      {value: 'three', raw: {value: 'three'}}
    ], 42, true, false);
  }

  function fakeGetWithAsyncResults(query, cb) {
    setTimeout(function() {
      cb([
        {value: 'four', raw: {value: 'four'}},
        {value: 'five', raw: {value: 'five'}}
      ]);
    }, 0);
  }
});
