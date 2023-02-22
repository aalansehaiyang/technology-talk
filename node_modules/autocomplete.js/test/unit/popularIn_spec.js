'use strict';

/* eslint-env mocha, jasmine */

describe('popularIn', function() {
  require('../../src/common/dom.js').element = require('jquery');
  require('../../src/jquery/plugin.js');

  var popularIn = require('../../src/sources/popularIn.js');

  beforeEach(function() {
  });

  function build(options) {
    var queries = {
      as: {
        _ua: 'javascript wrong agent',
      },
      search: function(q, params, cb) {
        cb(false, {
          hits: [
            { value: 'q1' },
            { value: 'q2' },
            { value: 'q3' }
          ]
        });
      }
    };
    var products = {
      as: {
        _ua: 'javascript wrong agent',
      },
      search: function(q, params, cb) {
        cb(false, {
          facets: {
            category: {
              c1: 42,
              c2: 21,
              c3: 2
            }
          }
        })
      }
    };
    var f = popularIn(queries, { hitsPerPage: 3 }, {
      source: 'value',
      index: products,
      facets: 'category',
      maxValuesPerFacet: 3
    }, options);

    var suggestions = [];
    function cb(hits) {
      suggestions = suggestions.concat(hits);
    }
    f('q', cb);
    return suggestions;
  }

  it('should query 2 indices and build the combinatory', function() {
    var suggestions = build();
    expect(suggestions.length).toEqual(5);
    expect(suggestions[0].value).toEqual('q1');
    expect(suggestions[0].facet.value).toEqual('c1');
    expect(suggestions[1].value).toEqual('q1');
    expect(suggestions[1].facet.value).toEqual('c2');
    expect(suggestions[2].value).toEqual('q1');
    expect(suggestions[2].facet.value).toEqual('c3');
    expect(suggestions[3].value).toEqual('q2');
    expect(suggestions[3].facet).toBe(undefined);
    expect(suggestions[4].value).toEqual('q3');
    expect(suggestions[4].facet).toBe(undefined);
  });

  it('should include the all department entry', function() {
    var suggestions = build({includeAll: true});
    expect(suggestions.length).toEqual(6);
    expect(suggestions[0].value).toEqual('q1');
    expect(suggestions[0].facet.value).toEqual('All departments');
    expect(suggestions[1].value).toEqual('q1');
    expect(suggestions[1].facet.value).toEqual('c1');
    expect(suggestions[2].value).toEqual('q1');
    expect(suggestions[2].facet.value).toEqual('c2');
    expect(suggestions[3].value).toEqual('q1');
    expect(suggestions[3].facet.value).toEqual('c3');
    expect(suggestions[4].value).toEqual('q2');
    expect(suggestions[4].facet).toBe(undefined);
    expect(suggestions[5].value).toEqual('q3');
    expect(suggestions[5].facet).toBe(undefined);
  });

  it('should include the all department entry with a custom title', function() {
    var suggestions = build({includeAll: true, allTitle: 'ALL'});
    expect(suggestions.length).toEqual(6);
    expect(suggestions[0].value).toEqual('q1');
    expect(suggestions[0].facet.value).toEqual('ALL');
  });

  it('should not include the all department entry when no results', function() {
    var queries = {
      as: {
        _ua: 'Algolia for vanilla JavaScript 4.3.6'
      },
      search: function(q, params, cb) {
        cb(false, {
          hits: []
        });
      }
    };
    var products = {
      as: {
        _ua: 'javascript wrong agent',
      },
      search: function(q, params, cb) {
        throw new Error('Never reached');
      }
    };
    var f = popularIn(queries, { hitsPerPage: 3 }, {
      source: 'value',
      index: products
    }, {
      includeAll: true
    });

    var suggestions = [];
    function cb(hits) {
      suggestions = suggestions.concat(hits);
    }
    f('q', cb);
    expect(suggestions.length).toEqual(0);
  });

});
