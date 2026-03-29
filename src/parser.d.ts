import nearley from 'nearley';
import type { EDTFType } from './types';
export interface Constraints {
    level: 0 | 1 | 2;
    types: EDTFType[];
    seasonIntervals: boolean;
}
export interface ParserResult {
    level: 0 | 1 | 2;
    type: EDTFType;
    values: number[];
    uncertain?: number;
    approximate?: number;
    unspecified?: number;
    significant?: number;
}
export declare const defaults: Constraints;
export declare function parse(input: string, constraints?: Partial<Constraints>): ParserResult;
export declare function parser(): nearley.Parser;
