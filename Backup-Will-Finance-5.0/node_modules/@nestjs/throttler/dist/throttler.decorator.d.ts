export declare const Throttle: (limit?: number, ttl?: number) => MethodDecorator & ClassDecorator;
export declare const SkipThrottle: (skip?: boolean) => MethodDecorator & ClassDecorator;
export declare const InjectThrottlerOptions: () => (target: object, key: string | symbol, index?: number) => void;
export declare const InjectThrottlerStorage: () => (target: object, key: string | symbol, index?: number) => void;
