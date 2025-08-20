interface Logger {
    info: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
}
export declare const logger: Logger;
export {};
