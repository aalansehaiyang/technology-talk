'use strict';

/* eslint-env mocha, jasmine */

var _ = require('../../src/common/utils.js');

describe('escapeHTML', function() {
  it('should escape HTML but preserve the default tags', function() {
    var test = '<em><img src=VALUE1 onerror=alert(1) /></em>' +
    'OTHER CONTENT<em>VALUE2</em>OTHER CONTENT$';
    var actual = _.escapeHighlightedString(test);
    expect(actual).toEqual('<em>&lt;img src=VALUE1 onerror=alert(1) /&gt;</em>OTHER CONTENT<em>VALUE2</em>OTHER CONTENT$');
  });

  it('should escape HTML but preserve the default tags when using custom tags', function() {
    var test = '<span class="highlighted"><img src=VALUE1 onerror=alert(1) /></span>' +
    'OTHER CONTENT<span class="highlighted">VALUE2</span>OTHER CONTENT$';
    var actual = _.escapeHighlightedString(test, '<span class="highlighted">', '</span>');
    expect(actual).toEqual('<span class="highlighted">&lt;img src=VALUE1 onerror=alert(1) /&gt;</span>OTHER CONTENT<span class="highlighted">VALUE2</span>OTHER CONTENT$');
  });

  it('should report the isMsie state correctly', function() {
    var actual = _.isMsie();
    expect(actual).toEqual(false);
  });

  it('should report the isMsie state correctly under a non-IE browser', function() {
    var ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36';
    var actual = _.isMsie(ua);
    expect(actual).toEqual(false);
  });

  it('should report the isMsie state correctly under an IE browser', function() {
    var ua = 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko';
    var actual = _.isMsie(ua);
    expect(actual).toEqual('11.0');
  });

  it('should report the isMsie state correctly under a browser that includes Trident but is not IE', function() {
    var ua = 'Mozilla/5.0 (iPad; CPU OS 11_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15G77 KurogoVersion/2.7.7 (Kurogo iOS Tablet) KurogoOSVersion/11.4.1 KurogoAppVersion/2.0.1 (com.telerik.TridentUniversity)';
    var actual = _.isMsie(ua);
    expect(actual).toEqual(false);
  });
});

describe('every', function() {
  // simulating an implementation of Array.prototype.each
  _.each = function(obj, callback) {
    for (var i = 0; i < obj.length; i++) {
      callback(obj[i], i, _);
      // note that we do not return here to break for loop, angular does not do this
    }
  };

  it('_.every should return false when at least one result is false', function() {
    expect(
      _.every([
        {isEmpty: true},
        {isEmpty: false}
      ], function(dataset) {
        return dataset.isEmpty;
      })).toEqual(false);
  });

  it('_.every should return false when each result is false', function() {
    expect(
      _.every([
        {isEmpty: false},
        {isEmpty: false}
      ], function(dataset) {
        return dataset.isEmpty;
      })).toEqual(false);
  });

  it('_.every should return true when all results are true', function() {
    expect(
      _.every([
        {isEmpty: true},
        {isEmpty: true}
      ], function(dataset) {
        return dataset.isEmpty;
      })).toEqual(true);
  });
});
