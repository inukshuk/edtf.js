import * as types from './types.js';
import { Constraints, ParserResult } from './parser.js';
export declare function edtf(...args: [string | number | ParserResult] | [string, Partial<Constraints>]): types.Year | types.Date | types.Decade | types.Season | types.Interval | types.List | types.Century;
