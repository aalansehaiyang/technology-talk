'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _test = require('tape');

var _test2 = _interopRequireDefault(_test);

var _f = require('../');

var _f2 = _interopRequireDefault(_f);

_test2['default']('class instatiation', function (t) {
  var A = _f2['default'](function A(name) {
    _classCallCheck(this, A);

    this.name = name;
  });
  var withNew = new A('withNew');
  var withoutNew = A('withoutNew');
  t.ok(withNew, 'withNew is sane');
  t.ok(withNew instanceof A, 'withNew is instance of A');
  t.equal(withNew.name, 'withNew', 'withNew has instance property');

  t.ok(withoutNew, 'withoutNew is sane');
  t.ok(withoutNew instanceof A, 'withoutNew is instance of A');
  t.ok(withoutNew.name, 'withoutNew', 'withoutNew has instance property');
  t.end();
});

_test2['default']('proto methods', function (t) {
  var expected = Symbol();
  var A = _f2['default']((function () {
    function A() {
      _classCallCheck(this, A);
    }

    _createClass(A, [{
      key: 'test',
      value: function test() {
        return expected;
      }
    }]);

    return A;
  })());

  var withNew = new A();
  var withoutNew = A();
  t.equal(withNew.test(), expected, 'proto method with new');
  t.equal(withoutNew.test(), expected, 'proto method without new');
  t.end();
});

_test2['default']('static properties', function (t) {
  var expected = Symbol();

  var A = function A() {
    _classCallCheck(this, A);
  };

  A.property = expected;
  var B = _f2['default'](A);

  t.equal(B.property, expected, 'static property exists');
  t.end();
});

_test2['default']('inheritance', function (t) {
  var expected = Symbol();

  var A = (function () {
    function A(name) {
      _classCallCheck(this, A);

      this.name = name;
    }

    _createClass(A, [{
      key: 'test',
      value: function test() {
        return expected;
      }
    }]);

    return A;
  })();

  A.property = expected;

  var B = _f2['default'](A);

  var C = _f2['default']((function (_A) {
    function C(name) {
      _classCallCheck(this, C);

      _get(Object.getPrototypeOf(C.prototype), 'constructor', this).call(this, name.toUpperCase());
    }

    _inherits(C, _A);

    _createClass(C, [{
      key: 'test2',
      value: function test2() {
        return _get(Object.getPrototypeOf(C.prototype), 'test', this).call(this);
      }
    }]);

    return C;
  })(A));

  t.equal(B.property, expected, 'static property exists');

  var withNew = new C('withNew');
  var withoutNew = C('withoutNew');

  t.equal(withNew.name, 'WITHNEW', 'withNew has instance property');
  t.equal(withoutNew.name, 'WITHOUTNEW', 'withoutNew has instance property');

  t.equal(withNew.test(), expected, 'withNew inherited proto method call');
  t.equal(withoutNew.test(), expected, 'withoutNew inherited proto method call');
  t.equal(withNew.test2(), expected, 'withNew inherited proto method call');
  t.equal(withoutNew.test2(), expected, 'withoutNew inherited proto method call');
  t.end();
});

