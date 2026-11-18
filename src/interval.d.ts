import { ExtDateTime } from './interface.js';
export declare class Interval extends ExtDateTime {
    constructor(...args: any[]);
    get lower(): any;
    set lower(value: any);
    get upper(): any;
    set upper(value: any);
    get finite(): boolean;
    [Symbol.iterator](): Generator<any, void, any>;
    get values(): any;
    get min(): any;
    get max(): any;
    toEDTF(): any;
}
