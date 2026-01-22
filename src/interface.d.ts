import { ParserResult } from './parser.js';
import { EDTFType } from './types.js';
export declare abstract class ExtDateTime {
    abstract values: number[];
    constructor(input: number | string | ExtDateTime | Partial<ParserResult> | undefined);
    static get type(): EDTFType;
    static parse(input: string): ParserResult;
    static from(input: ExtDateTime | string): any;
    static UTC(...args: Parameters<typeof Date.UTC>): number;
    get type(): any;
    get edtf(): string;
    get isEDTF(): boolean;
    abstract toEDTF(): string;
    toJSON(): string;
    toString(): string;
    toLocaleString(...args: any[]): any;
    inspect(): string;
    abstract min: number;
    abstract max: number;
    valueOf(): number;
    [Symbol.toPrimitive](hint: string): string | number;
    covers(other: this): boolean;
    compare(other: this): 0 | 1 | -1;
    includes(other: this): boolean;
    until(then: this): Generator<this, void, unknown>;
    through(then: this): Generator<this, void, unknown>;
    between(then: this): Generator<this, void, unknown>;
}
