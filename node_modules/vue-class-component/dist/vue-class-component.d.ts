import { ComponentOptions } from 'vue';
import { ComponentPublicInstance } from 'vue';
import { SetupContext } from 'vue';
import { UnwrapRef } from 'vue';
import { VNode } from 'vue';

export declare interface ClassComponentHooks {
    data?(): object;
    beforeCreate?(): void;
    created?(): void;
    beforeMount?(): void;
    mounted?(): void;
    beforeUnmount?(): void;
    unmounted?(): void;
    beforeUpdate?(): void;
    updated?(): void;
    activated?(): void;
    deactivated?(): void;
    render?(): VNode | void;
    errorCaptured?(err: Error, vm: Vue, info: string): boolean | undefined;
    serverPrefetch?(): Promise<unknown>;
}

export declare function createDecorator(factory: (options: ComponentOptions, key: string, index: number) => void): VueDecorator;

export declare type ExtractInstance<T> = T extends VueMixin<infer V> ? V : never;

export declare type MixedVueBase<Mixins extends VueMixin[]> = Mixins extends (infer T)[] ? VueBase<UnionToIntersection<ExtractInstance<T>> & Vue> & PropsMixin : never;

export declare function mixins<T extends VueMixin[]>(...Ctors: T): MixedVueBase<T>;

export declare function Options<V extends Vue>(options: ComponentOptions & ThisType<V>): <VC extends VueBase>(target: VC) => VC;

export declare interface PropsMixin {
    new <Props = unknown>(...args: any[]): {
        $props: Props;
    };
}

export declare function setup<R>(setupFn: () => R): UnwrapRef<R>;

export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export declare type Vue<Props = unknown> = ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, Props> & ClassComponentHooks;

export declare const Vue: VueConstructor;

export declare type VueBase<V extends Vue = Vue> = VueMixin<V> & (new (...args: any[]) => V);

export declare interface VueConstructor extends VueStatic {
    new <Props = unknown>(prop: Props, ctx: SetupContext): Vue<Props>;
}

export declare interface VueDecorator {
    (Ctor: VueBase): void;
    (target: Vue, key: string): void;
    (target: Vue, key: string, index: number): void;
}

export declare type VueMixin<V extends Vue = Vue> = VueStatic & {
    prototype: V;
};

export declare interface VueStatic {
    /* Excluded from this release type: __vccCache */
    /* Excluded from this release type: __vccBase */
    /* Excluded from this release type: __vccDecorators */
    /* Excluded from this release type: __vccMixins */
    /* Excluded from this release type: __vccHooks */
    /* Excluded from this release type: __vccOpts */
    /* Excluded from this release type: render */
    /* Excluded from this release type: ssrRender */
    /* Excluded from this release type: __file */
    /* Excluded from this release type: __cssModules */
    /* Excluded from this release type: __scopeId */
    /* Excluded from this release type: __hmrId */
    registerHooks(keys: string[]): void;
}

export { }
