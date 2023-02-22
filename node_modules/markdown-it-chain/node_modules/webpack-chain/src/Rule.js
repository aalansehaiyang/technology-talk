const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const Use = require('./Use');

module.exports = class Rule extends ChainedMap {
  constructor(parent, name) {
    super(parent);
    this.name = name;
    this.names = [];

    let rule = this;
    while (rule instanceof Rule) {
      this.names.unshift(rule.name);
      rule = rule.parent;
    }

    this.uses = new ChainedMap(this);
    this.include = new ChainedSet(this);
    this.exclude = new ChainedSet(this);
    this.oneOfs = new ChainedMap(this);
    this.extend([
      'enforce',
      'issuer',
      'parser',
      'resource',
      'resourceQuery',
      'sideEffects',
      'test',
      'type',
    ]);
  }

  use(name) {
    return this.uses.getOrCompute(name, () => new Use(this, name));
  }

  oneOf(name) {
    return this.oneOfs.getOrCompute(name, () => new Rule(this, name));
  }

  pre() {
    return this.enforce('pre');
  }

  post() {
    return this.enforce('post');
  }

  toConfig() {
    const config = this.clean(
      Object.assign(this.entries() || {}, {
        include: this.include.values(),
        exclude: this.exclude.values(),
        oneOf: this.oneOfs.values().map(oneOf => oneOf.toConfig()),
        use: this.uses.values().map(use => use.toConfig()),
      })
    );

    Object.defineProperties(config, {
      __ruleNames: { value: this.names },
    });

    return config;
  }

  merge(obj, omit = []) {
    if (!omit.includes('include') && 'include' in obj) {
      this.include.merge(obj.include);
    }

    if (!omit.includes('exclude') && 'exclude' in obj) {
      this.exclude.merge(obj.exclude);
    }

    if (!omit.includes('use') && 'use' in obj) {
      Object.keys(obj.use).forEach(name => this.use(name).merge(obj.use[name]));
    }

    if (!omit.includes('oneOf') && 'oneOf' in obj) {
      Object.keys(obj.oneOf).forEach(name =>
        this.oneOf(name).merge(obj.oneOf[name])
      );
    }

    if (!omit.includes('test') && 'test' in obj) {
      this.test(obj.test instanceof RegExp ? obj.test : new RegExp(obj.test));
    }

    return super.merge(obj, [
      ...omit,
      'include',
      'exclude',
      'use',
      'oneOf',
      'test',
    ]);
  }
};
