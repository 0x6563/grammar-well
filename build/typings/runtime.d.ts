import { ASTGrammarSymbolLiteral, ASTGrammarSymbolToken, ASTLexerStateImportRule, ASTLexerStateMatchRule, ASTLexerStateNonMatchRule } from "./ast";
import { Dictionary, Override } from "./common";
import { LRState } from ".";
export interface RuntimeLanguageDefinition {
    lexer?: RuntimeLexer | RuntimeLexerConfig;
    grammar: {
        start: string;
        rules: Dictionary<RuntimeGrammarProductionRule[]>;
    };
    lr?: {
        k: number;
        table: Dictionary<LRState>;
    };
}
export interface RuntimeGrammarProductionRule {
    name: string;
    symbols: RuntimeGrammarRuleSymbol[];
    postprocess?: RuntimePostProcessor;
}
export type RuntimeGrammarRuleSymbol = string | RegExp | ASTGrammarSymbolLiteral | ASTGrammarSymbolToken | RuntimeGrammarRuleSymbolFunction;
type RuntimeGrammarRuleSymbolFunction = (data: RuntimeLexerToken) => boolean;
export type RuntimePostProcessor = (payload: RuntimePostProcessorPayload) => any;
interface RuntimePostProcessorPayload {
    data: any[];
    rule: RuntimeGrammarProductionRule;
    meta: any;
}
export interface RuntimeLexerConfig {
    start?: string;
    states: Dictionary<RuntimeLexerState>;
}
export interface RuntimeLexerState {
    name: string;
    unmatched?: ASTLexerStateNonMatchRule;
    default?: RuntimeLexerStateMatchRule;
    rules: (ASTLexerStateImportRule | RuntimeLexerStateMatchRule)[];
}
export interface RuntimeLexer {
    next(): RuntimeLexerToken | undefined;
    feed(chunk?: string, state?: ReturnType<RuntimeLexer['state']>): void;
    state(): any;
    flush?(): void;
}
export interface RuntimeLexerToken {
    type?: string | undefined;
    tag?: Set<string>;
    value: string;
    offset: number;
    line: number;
    column: number;
}
export type RuntimeLexerStateMatchRule = Override<ASTLexerStateMatchRule, {
    when: string | RegExp;
}>;
export interface RuntimeLexerStateDefinition {
    name: string;
    unmatched?: ASTLexerStateNonMatchRule;
    rules: RuntimeLexerStateMatchRule[];
}
export {};
