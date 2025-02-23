export declare function num(data: number | string | string[]): number;
export declare function join(data: any[]): string;
export declare function zero(): number;
export declare function nothing(): any;
export declare function pick<T>(...args: T[]): (data: any) => any;
export declare function pluck(...args: any[]): (data: any) => any[];
export declare function concat<T>(data: T[], idx?: ArrayIterator<number>): T[];
export declare function merge(...args: any[]): (data: any) => any;
export declare function interval(level: any): (data: any) => {
    values: any[];
    type: string;
    level: any;
};
export declare function masked(type?: string, symbol?: string): (data: any, _: any, reject: any) => any;
export declare function date(values: any, level?: number, extra?: any): any;
export declare function year(values: any, level?: number, extra?: any): any;
export declare function century(value: any, level?: number): {
    type: string;
    level: number;
    values: any[];
};
export declare function decade(value: any, level?: number): {
    type: string;
    level: number;
    values: any[];
};
export declare function datetime(data: any): {
    values: number[];
    offset: any;
    type: string;
    level: number;
};
export declare function season(data: any, level?: number): {
    type: string;
    level: number;
    values: number[];
};
export declare function list(data: any): any;
export declare function qualify([parts]: [any], _: any, reject: any): any;
