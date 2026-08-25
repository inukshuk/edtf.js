import { ExtDateTime } from './interface.js';
import type { ParserResult } from './parser.js';
export declare class Year extends ExtDateTime {
    constructor(input: number | string | Year | Partial<ParserResult> | undefined);
    get year(): number;
    set year(year: number);
    get significant(): number;
    set significant(digits: number);
    get values(): number[];
    get min(): number;
    get max(): number;
    toEDTF(): string;
}
