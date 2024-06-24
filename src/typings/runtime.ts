import { LRState } from "./index.js";
import { ASTGrammarSymbolLiteral, ASTGrammarSymbolToken, ASTLexerStateMatchRule, ASTLexerStateNonMatchRule } from "./ast.js";
import { Dictionary } from "./common.js";

export interface RuntimeLanguageDefinition {
    lexer?: RuntimeLexer | RuntimeLexerConfig;
    grammar: {
        start: string;
        rules: Dictionary<RuntimeGrammarProductionRule[]>;
    }
    lr?: {
        k: number;
        table: Dictionary<LRState>;
    }
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
    rules: ASTLexerStateMatchRule[];
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
} 
