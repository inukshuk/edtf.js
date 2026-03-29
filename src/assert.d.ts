export declare function assert(value: any, message?: string): boolean;
export declare namespace assert {
    var equal: typeof import("./assert").equal;
}
export declare function equal<T>(actual: T, expected: T, message?: string): boolean;
export default assert;
