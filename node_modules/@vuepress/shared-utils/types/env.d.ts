declare class ENV {
    isDebug: boolean;
    isTest: boolean;
    isProduction: boolean;
    constructor();
    setOptions(options: Record<string, boolean>): void;
}
declare const _default: ENV;
export = _default;
