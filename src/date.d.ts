import { Bitmask } from "./bitmask.js";
import { ParserResult } from "./parser.js";
export declare class Date extends globalThis.Date {
    constructor(...args: ConstructorParameters<typeof globalThis.Date> | Partial<ParserResult>[]);
    set precision(value: number);
    get precision(): number;
    set uncertain(value: boolean);
    get uncertain(): boolean;
    set approximate(value: number);
    get approximate(): number;
    set unspecified(value: number);
    get unspecified(): number;
    get atomic(): boolean;
    get min(): number;
    get max(): number;
    get year(): number;
    get month(): number;
    get date(): number;
    get hours(): number;
    get minutes(): number;
    get seconds(): number;
    get values(): number[];
    /**
     * Returns the next second, day, month, or year, depending on
     * the current date's precision. Uncertain, approximate and
     * unspecified masks are copied.
     */
    next(k?: number): Date;
    prev(k?: number): Date;
    [Symbol.iterator](): Generator<this, void, unknown>;
    toEDTF(): string;
    format(...args: any[]): any;
    static pad(number: any, idx?: number): string;
    bits(value: any): Bitmask;
}
export declare const pad: typeof Date.pad;
