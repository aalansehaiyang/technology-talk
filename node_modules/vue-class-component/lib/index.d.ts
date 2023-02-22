import Vue, { ComponentOptions } from 'vue';
import { VueClass } from './declarations';
export { createDecorator, VueDecorator, mixins } from './util';
declare function Component<V extends Vue>(options: ComponentOptions<V> & ThisType<V>): <VC extends VueClass<V>>(target: VC) => VC;
declare namespace Component {
    var registerHooks: (keys: string[]) => void;
}
declare function Component<VC extends VueClass<Vue>>(target: VC): VC;
declare namespace Component {
    var registerHooks: (keys: string[]) => void;
}
export default Component;
