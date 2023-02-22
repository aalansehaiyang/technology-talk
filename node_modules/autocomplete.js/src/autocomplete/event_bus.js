'use strict';

var namespace = 'autocomplete:';

var _ = require('../common/utils.js');
var DOM = require('../common/dom.js');

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
