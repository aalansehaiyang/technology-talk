'use strict';

/* eslint-env mocha, jasmine */

describe('EventEmitter', function() {
  require('../../src/common/dom.js').element = require('jquery');
  require('../../src/jquery/plugin.js');

  var EventEmitter = require('../../src/autocomplete/event_emitter.js');
  var _ = require('../../src/common/utils.js');
  var waitsForAndRuns = require('../helpers/waits_for.js');

  beforeEach(function() {
    this.spy = jasmine.createSpy();
    this.target = _.mixin({}, EventEmitter);
  });

  it('methods should be chainable', function() {
    expect(this.target.onSync()).toEqual(this.target);
    expect(this.target.onAsync()).toEqual(this.target);
    expect(this.target.off()).toEqual(this.target);
    expect(this.target.trigger()).toEqual(this.target);
  });

  it('#on should take the context a callback should be called in', function(done) {
    var context = {val: 3};
    var cbContext;

    this.target.onSync('xevent', setCbContext, context).trigger('xevent');

    waitsForAndRuns(assertCbContext, done, 100);

    function setCbContext() {
      cbContext = this;
    }

    function assertCbContext() {
      return cbContext === context;
    }
  });

  it('#onAsync callbacks should be invoked asynchronously', function(done) {
    this.target.onAsync('event', this.spy).trigger('event');

    expect(this.spy.calls.count()).toBe(0);
    waitsForAndRuns(assertCallCount(this.spy, 1), done, 100);
  });

  it('#onSync callbacks should be invoked synchronously', function() {
    this.target.onSync('event', this.spy).trigger('event');

    expect(this.spy.calls.count()).toBe(1);
  });

  it('#off should remove callbacks', function(done) {
    this.target
      .onSync('event1 event2', this.spy)
      .onAsync('event1 event2', this.spy)
      .off('event1 event2')
      .trigger('event1 event2');

    setTimeout(assertCallCount(this.spy, 0, done), 100);
  });

  it('methods should accept multiple event types', function(done) {
    this.target
      .onSync('event1 event2', this.spy)
      .onAsync('event1 event2', this.spy)
      .trigger('event1 event2');

    expect(this.spy.calls.count()).toBe(2);
    setTimeout(assertCallCount(this.spy, 4, done), 100);
  });

  it('the event type should be passed to the callback', function(done) {
    this.target
      .onSync('sync', this.spy)
      .onAsync('async', this.spy)
      .trigger('sync async');

    var that = this;
    waitsForAndRuns(assertArgs(this.spy, 0, ['sync']), function() {
      waitsForAndRuns(assertArgs(that.spy, 1, ['async']), done, 100);
    }, 100);
  });

  it('arbitrary args should be passed to the callback', function(done) {
    this.target
      .onSync('event', this.spy)
      .onAsync('event', this.spy)
      .trigger('event', 1, 2);

    var that = this;
    waitsForAndRuns(assertArgs(this.spy, 0, ['event', 1, 2]), function() {
      waitsForAndRuns(assertArgs(that.spy, 1, ['event', 1, 2]), done, 100);
    }, 100);
  });

  it('callback execution should be cancellable', function(done) {
    var cancelSpy = jasmine.createSpy().and.callFake(cancel);

    this.target
      .onSync('one', cancelSpy)
      .onSync('one', this.spy)
      .onAsync('two', cancelSpy)
      .onAsync('two', this.spy)
      .onSync('three', cancelSpy)
      .onAsync('three', this.spy)
      .trigger('one two three');

    var that = this;
    setTimeout(assertCallCount(cancelSpy, 3, function() {
      setTimeout(assertCallCount(that.spy, 0, done), 100);
    }), 100);

    function cancel() {
      return false;
    }
  });

  function assertCallCount(spy, expected, done) {
    return function() {
      expect(spy.calls.count()).toBe(expected);
      done && done();
    };
  }

  function assertArgs(spy, call, expected) {
    return function() {
      var actual = spy.calls.argsFor(call);
      return expect(actual).toEqual(expected);
    };
  }
});
