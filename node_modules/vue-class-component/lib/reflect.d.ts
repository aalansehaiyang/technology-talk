import Vue, { VueConstructor } from 'vue';
import { VueClass } from './declarations';
export declare function reflectionIsSupported(): false | typeof Reflect.getOwnMetadataKeys;
export declare function copyReflectionMetadata(to: VueConstructor, from: VueClass<Vue>): void;
