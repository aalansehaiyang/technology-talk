declare class Performance {
    private _totalMemory;
    private _startFreeMemory;
    private _endFreeMemory;
    private _startTime;
    private _endTime;
    constructor();
    start(): void;
    stop(): {
        duration: number;
        memoryDiff: number;
    };
}
declare const _default: Performance;
export = _default;
