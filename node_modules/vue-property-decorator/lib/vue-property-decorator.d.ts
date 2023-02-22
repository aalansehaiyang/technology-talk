import Vue, { PropOptions, WatchOptions } from 'vue';
import Component, { mixins } from 'vue-class-component';
import { InjectKey } from 'vue/types/options';
export declare type Constructor = {
    new (...args: any[]): any;
};
export { Component, Vue, mixins as Mixins };
declare type InjectOptions = {
    from?: InjectKey;
    default?: any;
};
/**
 * decorator of an inject
 * @param from key
 * @return PropertyDecorator
 */
export declare function Inject(options?: InjectOptions | InjectKey): import("vue-class-component").VueDecorator;
/**
 * decorator of a reactive inject
 * @param from key
 * @return PropertyDecorator
 */
export declare function InjectReactive(options?: InjectOptions | InjectKey): import("vue-class-component").VueDecorator;
/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
export declare function Provide(key?: string | symbol): import("vue-class-component").VueDecorator;
/**
 * decorator of a reactive provide
 * @param key key
 * @return PropertyDecorator | void
 */
export declare function ProvideReactive(key?: string | symbol): import("vue-class-component").VueDecorator;
/**
 * decorator of model
 * @param  event event name
 * @param options options
 * @return PropertyDecorator
 */
export declare function Model(event?: string, options?: PropOptions | Constructor[] | Constructor): (target: Vue, key: string) => void;
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
export declare function Prop(options?: PropOptions | Constructor[] | Constructor): (target: Vue, key: string) => void;
/**
 * decorator of a synced prop
 * @param propName the name to interface with from outside, must be different from decorated property
 * @param options the options for the synced prop
 * @return PropertyDecorator | void
 */
export declare function PropSync(propName: string, options?: PropOptions | Constructor[] | Constructor): PropertyDecorator;
/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
export declare function Watch(path: string, options?: WatchOptions): import("vue-class-component").VueDecorator;
/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
export declare function Emit(event?: string): (_target: Vue, propertyKey: string, descriptor: any) => void;
/**
 * decorator of a ref prop
 * @param refKey the ref key defined in template
 */
export declare function Ref(refKey?: string): import("vue-class-component").VueDecorator;
