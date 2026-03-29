import { List } from './list.js';
export declare class Set extends List {
    static parse(input: any): import("./parser.js").ParserResult;
    get type(): string;
    wrap(content: any): string;
}
