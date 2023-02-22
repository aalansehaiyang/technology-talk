import Vue from 'vue';
import { warn } from './util';
export function collectDataFromConstructor(vm, Component) {
    // override _init to prevent to init as Vue instance
    const originalInit = Component.prototype._init;
    Component.prototype._init = function () {
        // proxy to actual vm
        const keys = Object.getOwnPropertyNames(vm);
        // 2.2.0 compat (props are no longer exposed as self properties)
        if (vm.$options.props) {
            for (const key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(key => {
            Object.defineProperty(this, key, {
                get: () => vm[key],
                set: value => { vm[key] = value; },
                configurable: true
            });
        });
    };
    // should be acquired class property values
    const data = new Component();
    // restore original _init to avoid memory leak (#209)
    Component.prototype._init = originalInit;
    // create plain data object
    const plainData = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            plainData[key] = data[key];
        }
    });
    if (process.env.NODE_ENV !== 'production') {
        if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
            warn('Component class must inherit Vue or its descendant class ' +
                'when class property is used.');
        }
    }
    return plainData;
}
