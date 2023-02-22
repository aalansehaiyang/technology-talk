'use strict';

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('utils', function () {
  describe('mergeKeyWithParent', function () {
    it('should move all subkeys to parent', function () {
      // Given
      var input = {
        name: 'foo',
        hierarchy: {
          lvl0: 'bar',
          lvl1: 'baz'
        }
      };

      // When
      var actual = _utils2.default.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual.lvl0).toEqual('bar');
      expect(actual.lvl1).toEqual('baz');
    });
    it('should delete the attribute', function () {
      // Given
      var input = {
        name: 'foo',
        hierarchy: {
          lvl0: 'bar',
          lvl1: 'baz'
        }
      };

      // When
      var actual = _utils2.default.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual.hierarchy).toEqual(undefined);
    });

    it('should overwrite key if present', function () {
      // Given
      var input = {
        name: 'foo',
        lvl0: 42,
        hierarchy: {
          lvl0: 'bar',
          lvl1: 'baz'
        }
      };

      // When
      var actual = _utils2.default.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual.lvl0).not.toEqual(42);
      expect(actual.lvl0).toEqual('bar');
    });
    it('should do nothing if no such key', function () {
      // Given
      var input = {
        name: 'foo'
      };

      // When
      var actual = _utils2.default.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual).toBe(input);
    });
    it('should throw an error if key is no an object', function () {
      // Given
      var input = {
        name: 'foo',
        hierarchy: 42
      };

      // When
      var actual = _utils2.default.mergeKeyWithParent(input, 'hierarchy');

      // Then
      expect(actual).toBe(input);
    });
  });

  describe('groupBy', function () {
    it('group by specified key', function () {
      // Given
      var input = [{ name: 'Tim', category: 'devs' }, { name: 'Vincent', category: 'devs' }, { name: 'Ben', category: 'sales' }, { name: 'Jeremy', category: 'sales' }, { name: 'AlexS', category: 'devs' }, { name: 'AlexK', category: 'sales' }, { name: 'AlexK', category: 'constructor' }];

      // When
      var actual = _utils2.default.groupBy(input, 'category');

      // Expect
      expect(actual).toEqual({
        constructor: [{ category: 'constructor', name: 'AlexK' }],
        devs: [{ name: 'Tim', category: 'devs' }, { name: 'Vincent', category: 'devs' }, { name: 'AlexS', category: 'devs' }],
        sales: [{ name: 'Ben', category: 'sales' }, { name: 'Jeremy', category: 'sales' }, { name: 'AlexK', category: 'sales' }]
      });
    });
    it('group by key considering lowercase forms', function () {
      // Given
      var input = [{ name: 'Tim', category: 'devs' }, { name: 'Vincent', category: 'DeVs' }];

      // When
      var actual = _utils2.default.groupBy(input, 'category');

      // Expect
      expect(actual).toEqual({
        devs: [{ name: 'Tim', category: 'devs' }, { name: 'Vincent', category: 'DeVs' }]
      });
    });
    it('throw an error if key does not exist', function () {
      // Given
      var input = [{ name: 'Tim' }, { name: 'Vincent' }, { name: 'Ben' }, { name: 'Jeremy' }, { name: 'AlexS' }, { name: 'AlexK' }];

      // When
      expect(function () {
        _utils2.default.groupBy(input, 'category');
      }).toThrow(Error);
    });
  });

  describe('values', function () {
    it('should extract all values', function () {
      // Given
      var input = {
        foo: 42,
        bar: true,
        baz: 'yep'
      };

      // Given
      var actual = _utils2.default.values(input);

      // Then
      expect(actual).toEqual([42, true, 'yep']);
    });
  });

  describe('flatten', function () {
    // flatten values
    it('should flatten array on level deep', function () {
      // Given
      var input = [1, 2, [3, 4], [5, 6]];

      // Given
      var actual = _utils2.default.flatten(input);

      // Then
      expect(actual).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('flattenAndFlagFirst', function () {
    it('should flatten all values', function () {
      // Given
      var input = {
        devs: [{ name: 'Tim', category: 'dev' }, { name: 'Vincent', category: 'dev' }, { name: 'AlexS', category: 'dev' }],
        sales: [{ name: 'Ben', category: 'sales' }, { name: 'Jeremy', category: 'sales' }, { name: 'AlexK', category: 'sales' }]
      };

      // When
      var actual = _utils2.default.flattenAndFlagFirst(input, 'isTop');

      // Then
      expect(actual).toEqual([{ name: 'Tim', category: 'dev', isTop: true }, { name: 'Vincent', category: 'dev', isTop: false }, { name: 'AlexS', category: 'dev', isTop: false }, { name: 'Ben', category: 'sales', isTop: true }, { name: 'Jeremy', category: 'sales', isTop: false }, { name: 'AlexK', category: 'sales', isTop: false }]);
    });
  });

  describe('compact', function () {
    it('should clear all falsy elements from the array', function () {
      // Given
      var input = [42, false, null, undefined, '', [], 'foo'];

      // When
      var actual = _utils2.default.compact(input);

      // Then
      expect(actual).toEqual([42, [], 'foo']);
    });
  });

  describe('getHighlightedValue', function () {
    it('should return the highlighted version if exists', function () {
      // Given
      var input = {
        _highlightResult: {
          text: {
            value: '<mark>foo</mark>'
          }
        },
        text: 'foo'
      };

      // When
      var actual = _utils2.default.getHighlightedValue(input, 'text');

      // Then
      expect(actual).toEqual('<mark>foo</mark>');
    });
    it('should return the default key if no highlighted value', function () {
      // Given
      var input = {
        _highlightResult: {
          text: {}
        },
        text: 'foo'
      };

      // When
      var actual = _utils2.default.getHighlightedValue(input, 'text');

      // Then
      expect(actual).toEqual('foo');
    });
    it('should return the default key if no highlight results', function () {
      // Given
      var input = {
        text: 'foo'
      };

      // When
      var actual = _utils2.default.getHighlightedValue(input, 'text');

      // Then
      expect(actual).toEqual('foo');
    });
  });

  describe('getSnippetedValue', function () {
    it('should return the key value if no snippet returned', function () {
      // Given
      var input = {
        text: 'Foo'
      };

      // When
      var actual = _utils2.default.getSnippetedValue(input, 'text');

      // Then
      expect(actual).toEqual('Foo');
    });
    it('should return the key value if no snippet for this key', function () {
      // Given
      var input = {
        _snippetResult: {
          content: {
            value: '<mark>Bar</mark>'
          }
        },
        text: 'Foo',
        content: 'Bar'
      };

      // When
      var actual = _utils2.default.getSnippetedValue(input, 'text');

      // Then
      expect(actual).toEqual('Foo');
    });
    it('should add ellipsis at the start if snippet does not start with a capital letter', function () {
      // Given
      var input = {
        _snippetResult: {
          text: {
            value: 'this is the <mark>end</mark> of a sentence.'
          }
        },
        text: 'this is the end of a sentence.'
      };

      // When
      var actual = _utils2.default.getSnippetedValue(input, 'text');

      // Then
      expect(actual).toEqual('…this is the <mark>end</mark> of a sentence.');
    });
    it('should add ellipsis at the end if snippet does not end with a terminal point', function () {
      // Given
      var input = {
        _snippetResult: {
          text: {
            value: 'This is an <mark>finished</mark> sentence'
          }
        },
        text: 'This is an <mark>finished</mark> sentence'
      };

      // When
      var actual = _utils2.default.getSnippetedValue(input, 'text');

      // Then
      expect(actual).toEqual('This is an <mark>finished</mark> sentence…');
    });
  });

  describe('deepClone', function () {
    it('should create an object with the exact same value', function () {
      // Given
      var input = {
        foo: {
          bar: 'baz'
        }
      };

      // When
      var actual = _utils2.default.deepClone(input);

      // Then
      expect(actual.foo.bar).toEqual('baz');
    });
    it('should not change the initial object', function () {
      // Given
      var input = {
        foo: {
          bar: 'baz'
        }
      };

      // When
      var actual = _utils2.default.deepClone(input);
      input.foo.bar = 42;

      // Then
      expect(input.foo.bar).toEqual(42);
      expect(actual.foo.bar).not.toEqual(42);
      expect(actual.foo.bar).toEqual('baz');
    });
  });
});