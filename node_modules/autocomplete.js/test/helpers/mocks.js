'use strict';

var _ = require('../../src/common/utils.js');
var $ = require('jquery');
module.exports = function mock(Constructor) {
  var constructorSpy;

  Mock.prototype = Constructor.prototype;
  constructorSpy = jasmine.createSpy('mock constructor').and.callFake(Mock);

  // copy instance methods
  for (var key in Constructor) {
    if (typeof Constructor[key] === 'function') {
      constructorSpy[key] = Constructor[key];
    }
  }

  return constructorSpy;

  function Mock() {
    var instance = _.mixin({}, Constructor.prototype);

    for (var key in instance) {
      if (typeof instance[key] === 'function') {
        spyOn(instance, key);

        // special case for some components
        if (key === 'bind') {
          instance[key].and.callFake(function() { return this; });
        }
      }
    }

    // have the event emitter methods call through
    instance.onSync && instance.onSync.and.callThrough();
    instance.onAsync && instance.onAsync.and.callThrough();
    instance.off && instance.off.and.callThrough();
    instance.trigger && instance.trigger.and.callThrough();

    // have some datasets methods call through
    instance.getRoot && instance.getRoot.and.callFake(function() { return $('<span class="aa-dataset-fake" />'); });

    instance.constructor = Constructor;

    return instance;
  }
};
