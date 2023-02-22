import Vue from 'vue';
export const noop = () => { };
const fakeArray = { __proto__: [] };
export const hasProto = fakeArray instanceof Array;
export function createDecorator(factory) {
    return (target, key, index) => {
        const Ctor = typeof target === 'function'
            ? target
            : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        if (typeof index !== 'number') {
            index = undefined;
        }
        Ctor.__decorators__.push(options => factory(options, key, index));
    };
}
export function mixins(...Ctors) {
    return Vue.extend({ mixins: Ctors });
}
export function isPrimitive(value) {
    const type = typeof value;
    return value == null || (type !== 'object' && type !== 'function');
}
export function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
}
