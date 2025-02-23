import { ExtDateTime } from './interface.js';
export declare class Century extends ExtDateTime {
    constructor(input: any);
    get century(): any;
    set century(century: any);
    get year(): number;
    set year(year: number);
    get values(): any;
    get min(): number;
    get max(): number;
    toEDTF(): string;
    static pad(number: any): string;
}
