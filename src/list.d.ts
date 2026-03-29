import { ExtDateTime } from './interface.js';
export declare class List extends ExtDateTime {
    constructor(...args: any[]);
    get values(): any;
    get length(): any;
    get empty(): boolean;
    get first(): any;
    get last(): any;
    clear(): this;
    concat(...args: any[]): this;
    push(value: any): any;
    [Symbol.iterator](): Generator<any, void, any>;
    get min(): any;
    get max(): any;
    content(): any;
    toEDTF(): string;
    wrap(content: any): string;
}
