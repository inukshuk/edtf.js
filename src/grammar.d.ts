declare function id(x: any): any;
import { join } from './util.js';
declare const _default: {
    Lexer: any;
    ParserRules: ({
        name: string;
        symbols: {
            literal: string;
        }[];
        postprocess?: undefined;
    } | {
        name: string;
        symbols: string[];
        postprocess?: undefined;
    } | {
        name: string;
        symbols: (string | {
            literal: string;
        })[];
        postprocess: (data: any, _: any, reject: any) => any;
    } | {
        name: string;
        symbols: RegExp[];
        postprocess: typeof id;
    } | {
        name: string;
        symbols: (string | RegExp)[];
        postprocess: typeof join;
    } | {
        name: string;
        symbols: (RegExp | {
            literal: string;
        })[];
        postprocess: typeof join;
    })[];
    ParserStart: string;
};
export default _default;
