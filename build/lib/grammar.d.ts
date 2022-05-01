import { Lexer } from "./lexer";
import { Dictionary, Rule } from "../typings";
export declare class Grammar {
    rules: Rule[];
    start: string;
    map: Dictionary<Rule[]>;
    lexer: Lexer;
    constructor(rules: Rule[], start: string);
    static fromCompiled({ rules, start, lexer }: PrecompiledGrammar): Grammar;
}
export interface PrecompiledGrammar {
    lexer?: Lexer;
    start: string;
    rules: Rule[];
}
