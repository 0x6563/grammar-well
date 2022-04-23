import { Rule } from "./rule";
import { StreamLexer } from "./streamlexer";
import { Dictionary } from "../typings";
export declare class Grammar {
    rules: Rule[];
    start: any;
    byName: Dictionary<Rule[]>;
    lexer: StreamLexer;
    constructor(rules: Rule[], start: any);
    static fromCompiled(rules: any, start?: any): Grammar;
}
