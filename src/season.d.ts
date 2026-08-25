import { ExtDateTime } from './interface.js';
export declare class Season extends ExtDateTime {
    constructor(input: any);
    get year(): any;
    set year(year: any);
    get season(): any;
    set season(season: any);
    get values(): any;
    next(k?: number): Season;
    prev(k?: number): Season;
    get min(): number;
    get max(): number;
    toEDTF(): string;
}
