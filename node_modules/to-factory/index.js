function toFactory(Class) {
  const Factory = function(...args) {
    return new Class(...args)
  }
  Factory.__proto__ = Class
  Factory.prototype = Class.prototype
  return Factory
}

module.exports = toFactory
