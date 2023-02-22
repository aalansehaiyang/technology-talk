import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
export declare type ContainerRenderFunction = (tokens: Token[], index: number, options: any, env: any, self: Renderer) => string;
export interface ContainerOptions {
    marker?: string;
    validate?: (params: string) => boolean;
    render?: ContainerRenderFunction;
}
