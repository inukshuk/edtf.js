import { ExtDateTime } from './interface.js';
export declare class Decade extends ExtDateTime {
    constructor(input: any);
    get decade(): any;
    set decade(decade: any);
    get year(): number;
    set year(year: number);
    get values(): any;
    get min(): number;
    get max(): number;
    toEDTF(): string;
    static pad(number: any): string;
}
