import { ContainerOptions } from './markdown-it-container';
export declare type RenderPlaceFunction = (info: string) => string;
export interface ContainerPluginOptions extends ContainerOptions {
    before?: string | RenderPlaceFunction;
    after?: string | RenderPlaceFunction;
    type: string;
    defaultTitle: string | Record<string, string>;
}
