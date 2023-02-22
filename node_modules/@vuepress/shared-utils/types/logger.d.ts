interface LoggerOptions {
    logLevel: number;
}
declare class Logger {
    options: LoggerOptions;
    constructor(options?: LoggerOptions);
    setOptions(options: LoggerOptions): void;
    debug(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    success(...args: any[]): void;
    tip(...args: any[]): void;
    info(...args: any[]): void;
    wait(...args: any[]): void;
    status(color: string, label: string, ...args: any[]): void;
    developer(...args: any[]): void;
}
declare const _default: Logger;
/**
 * Expose a logger instance.
 */
export = _default;
