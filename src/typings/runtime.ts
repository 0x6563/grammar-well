import { LRState } from "./index.js";
import { ASTGrammarSymbolLiteral, ASTGrammarSymbolToken, ASTLexerStateNonMatchRule } from "./ast.js";
import { Dictionary } from "./common.js";

export interface RuntimeParserClass {
    artifacts: {
        lexer?: RuntimeLexer | RuntimeLexerConfig;
        grammar: {
            start: string;
            rules: Dictionary<RuntimeGrammarProductionRule[]>;
        }
        lr?: {
            k: number;
            table: Dictionary<LRState>;
        }
        tokenProcessor: () => ((token: RuntimeLexerToken) => RuntimeLexerToken) | undefined
    }
    new();
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
    start?: string
    states: Dictionary<RuntimeLexerState>;
}

export interface RuntimeLexerState {
    unmatched?: ASTLexerStateNonMatchRule;
    rules: RuntimeLexerStateMatchRule[];
    regex: RegExp;
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
    custom?: { [key: string]: any }
}


export interface RuntimeLexerStateMatchRule {
    when: string | RegExp;
    type?: string;
    tag?: string[];
    before?: boolean;
    skip?: boolean;
    highlight?: string;
    open?: string;
    close?: string;
    embed?: string;
    unembed?: boolean;

    pop?: number | 'all';
    inset?: number;
    goto?: string;
    set?: string;
}