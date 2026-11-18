/**
 * Bitmasks are used to set Unspecified, Uncertain and
 * Approximate flags for a Date. The bitmask for one
 * feature corresponds to a numeric value based on the
 * following pattern:
 *
 *           YYYYMMDD
 *           --------
 *   Day     00000011
 *   Month   00001100
 *   Year    11110000
 *
 */
export declare class Bitmask {
    value: number;
    static YEAR: number;
    static Y: number;
    static MONTH: number;
    static M: number;
    static DAY: number;
    static D: number;
    static MD: number;
    static YMD: number;
    static YM: number;
    static YYXX: number;
    static YYYX: number;
    static XXXX: number;
    static DX: number;
    static XD: number;
    static MX: number;
    static XM: number;
    static UA: [number, number, number, number, number, number];
    static test(a: Bitmask | number | boolean | string, b: Bitmask | number | boolean | string): number;
    static convert(value?: Bitmask | number | boolean | string): number;
    static compute(value: string): number;
    static values(mask: string, digit?: number): number[];
    static numbers(mask: string, digit?: number): string;
    static normalize(values: number[]): number[];
    constructor(value?: number);
    test(value?: number): number;
    is: (value?: number) => number;
    bit(k: number): number;
    get day(): number;
    get month(): number;
    get year(): number;
    add(value: string | number | boolean | Bitmask): this;
    set(value?: string | number | boolean | Bitmask): this;
    mask(input?: string[], offset?: number, symbol?: string): string[];
    masks(values: string[], symbol?: string): string[];
    max([year, month, day]: [number, number, number]): number[];
    min([year, month, day]: [number, number, number]): number[];
    marks(values: any, symbol?: string): any;
    qualified(idx: number): boolean;
    qualify(idx: number): this;
    toJSON(): number;
    toString(symbol?: string): string;
}
