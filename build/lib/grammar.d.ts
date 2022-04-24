import { Rule, RuleConfig } from "./rule";
import { Lexer } from "./lexer";
import { Dictionary } from "../typings";
export declare class Grammar {
    rules: Rule[];
    start: string;
    byName: Dictionary<Rule[]>;
    lexer: Lexer;
    constructor(rules: Rule[], start: string);
    static fromCompiled({ ParserRules, ParserStart, Lexer }: PrecompiledGrammar): Grammar;
}
interface PrecompiledGrammar {
    Lexer: Lexer;
    ParserStart: string;
    ParserRules: RuleConfig[];
}
export {};
