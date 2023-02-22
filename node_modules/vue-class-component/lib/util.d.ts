import Vue, { ComponentOptions } from 'vue';
import { VueClass } from './declarations';
export declare const noop: () => void;
export declare const hasProto: boolean;
export interface VueDecorator {
    (Ctor: typeof Vue): void;
    (target: Vue, key: string): void;
    (target: Vue, key: string, index: number): void;
}
export declare function createDecorator(factory: (options: ComponentOptions<Vue>, key: string, index: number) => void): VueDecorator;
export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export declare type ExtractInstance<T> = T extends VueClass<infer V> ? V : never;
export declare type MixedVueClass<Mixins extends VueClass<Vue>[]> = Mixins extends (infer T)[] ? VueClass<UnionToIntersection<ExtractInstance<T>>> : never;
export declare function mixins<A>(CtorA: VueClass<A>): VueClass<A>;
export declare function mixins<A, B>(CtorA: VueClass<A>, CtorB: VueClass<B>): VueClass<A & B>;
export declare function mixins<A, B, C>(CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>): VueClass<A & B & C>;
export declare function mixins<A, B, C, D>(CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>, CtorD: VueClass<D>): VueClass<A & B & C & D>;
export declare function mixins<A, B, C, D, E>(CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>, CtorD: VueClass<D>, CtorE: VueClass<E>): VueClass<A & B & C & D & E>;
export declare function mixins<T>(...Ctors: VueClass<Vue>[]): VueClass<T>;
export declare function mixins<T extends VueClass<Vue>[]>(...Ctors: T): MixedVueClass<T>;
export declare function isPrimitive(value: any): boolean;
export declare function warn(message: string): void;
