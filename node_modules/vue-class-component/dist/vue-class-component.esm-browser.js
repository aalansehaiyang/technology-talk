/**
  * vue-class-component v8.0.0-alpha.6
  * (c) 2015-present Evan You
  * @license MIT
  */
import { reactive } from 'vue';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function defineGetter(obj, key, getter) {
  Object.defineProperty(obj, key, {
    get: getter,
    enumerable: false,
    configurable: true
  });
}

function defineProxy(proxy, key, target) {
  Object.defineProperty(proxy, key, {
    get: () => target[key],
    set: value => {
      target[key] = value;
    },
    enumerable: true,
    configurable: true
  });
}

function getSuperOptions(Ctor) {
  var superProto = Object.getPrototypeOf(Ctor.prototype);

  if (!superProto) {
    return undefined;
  }

  var Super = superProto.constructor;
  return Super.__vccOpts;
}

class VueImpl {
  constructor(props, ctx) {
    defineGetter(this, '$props', () => props);
    defineGetter(this, '$attrs', () => ctx.attrs);
    defineGetter(this, '$slots', () => ctx.slots);
    defineGetter(this, '$emit', () => ctx.emit);
    Object.keys(props).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: props[key]
      });
    });
  }
  /** @internal */


  static get __vccOpts() {
    // Early return if `this` is base class as it does not have any options
    if (this === Vue) {
      return {};
    }

    var cache = this.hasOwnProperty('__vccCache') && this.__vccCache;

    if (cache) {
      return cache;
    }

    var Ctor = this; // If the options are provided via decorator use it as a base

    var options = this.__vccCache = this.hasOwnProperty('__vccBase') ? _objectSpread2({}, this.__vccBase) : {}; // Handle super class options

    options.extends = getSuperOptions(Ctor); // Handle mixins

    var mixins = this.hasOwnProperty('__vccMixins') && this.__vccMixins;

    if (mixins) {
      options.mixins = options.mixins ? options.mixins.concat(mixins) : mixins;
    }

    options.methods = _objectSpread2({}, options.methods);
    options.computed = _objectSpread2({}, options.computed);
    var proto = Ctor.prototype;
    Object.getOwnPropertyNames(proto).forEach(key => {
      if (key === 'constructor') {
        return;
      } // hooks


      if (Ctor.__vccHooks.indexOf(key) > -1) {
        options[key] = proto[key];
        return;
      }

      var descriptor = Object.getOwnPropertyDescriptor(proto, key); // methods

      if (typeof descriptor.value === 'function') {
        options.methods[key] = descriptor.value;
        return;
      } // computed properties


      if (descriptor.get || descriptor.set) {
        options.computed[key] = {
          get: descriptor.get,
          set: descriptor.set
        };
        return;
      }
    });

    options.setup = function (props, ctx) {
      var data = new Ctor(props, ctx);
      var dataKeys = Object.keys(data);
      var plainData = reactive({}); // Initialize reactive data and convert constructor `this` to a proxy

      dataKeys.forEach(key => {
        // Skip if the value is undefined not to make it reactive.
        // If the value has `__s`, it's a value from `setup` helper, proceed it later.
        if (data[key] === undefined || data[key] && data[key].__s) {
          return;
        }

        plainData[key] = data[key];
        defineProxy(data, key, plainData);
      }); // Invoke composition functions

      dataKeys.forEach(key => {
        if (data[key] && data[key].__s) {
          plainData[key] = data[key].__s();
        }
      });
      return plainData;
    };

    var decorators = this.hasOwnProperty('__vccDecorators') && this.__vccDecorators;

    if (decorators) {
      decorators.forEach(fn => fn(options));
    } // from Vue Loader


    var injections = ['render', 'ssrRender', '__file', '__cssModules', '__scopeId', '__hmrId'];
    injections.forEach(key => {
      if (Ctor[key]) {
        options[key] = Ctor[key];
      }
    });
    return options;
  }

  static registerHooks(keys) {
    this.__vccHooks.push(...keys);
  }

}
/** @internal */


VueImpl.__vccHooks = ['data', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUnmount', 'unmounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'render', 'errorCaptured', 'serverPrefetch'];
var Vue = VueImpl;

function Options(options) {
  return Component => {
    Component.__vccBase = options;
    return Component;
  };
}
function createDecorator(factory) {
  return (target, key, index) => {
    var Ctor = typeof target === 'function' ? target : target.constructor;

    if (!Ctor.__vccDecorators) {
      Ctor.__vccDecorators = [];
    }

    if (typeof index !== 'number') {
      index = undefined;
    }

    Ctor.__vccDecorators.push(options => factory(options, key, index));
  };
}
function mixins() {
  for (var _len = arguments.length, Ctors = new Array(_len), _key = 0; _key < _len; _key++) {
    Ctors[_key] = arguments[_key];
  }

  var _a;

  return _a = class MixedVue extends Vue {
    constructor(props, ctx) {
      super(props, ctx);
      Ctors.forEach(Ctor => {
        var data = new Ctor(props, ctx);
        Object.keys(data).forEach(key => {
          this[key] = data[key];
        });
      });
    }

  }, _a.__vccMixins = Ctors.map(Ctor => Ctor.__vccOpts), _a;
}
function setup(setupFn) {
  // Hack to delay the invocation of setup function.
  // Will be called after dealing with class properties.
  return {
    __s: setupFn
  };
}

export { Options, Vue, createDecorator, mixins, setup };
