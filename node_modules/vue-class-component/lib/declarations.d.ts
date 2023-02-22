import Vue, { ComponentOptions } from 'vue';
export declare type VueClass<V> = {
    new (...args: any[]): V & Vue;
} & typeof Vue;
export declare type DecoratedClass = VueClass<Vue> & {
    __decorators__?: ((options: ComponentOptions<Vue>) => void)[];
};
