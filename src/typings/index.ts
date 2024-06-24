import { TokenBuffer } from "../lexers/token-buffer.js";
import { ParserUtility } from "../parser/parser.js";
import { ASTLexerStateMatchRule, ASTLexerStateNonMatchRule } from "./ast.js";
import { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLanguageDefinition, RuntimeLexerStateMatchRule } from "./runtime.js";
export * from './ast.js';
export * from './common.js';
export * from './generator.js';
export * from './runtime.js';

export interface ImportResolver {
    path(path: string): string;
    body(path: string): Promise<string>;
}

export interface ImportResolverConstructor {
    new(basePath: string): ImportResolver;
}

export type ParserAlgorithm = ((language: RuntimeLanguageDefinition & { tokens: TokenBuffer; utility: ParserUtility }, options?: any) => { results: any[], info?: any });

export interface LRState {
    actions: Next[];
    goto: { [key: string]: string };
    reduce?: RuntimeGrammarProductionRule;
    isFinal: boolean;
}

type Next = { symbol: RuntimeGrammarRuleSymbol, next: string };

export interface TQRestorePoint {
    historyIndex: number;
    offset: number;
}
export interface StatefulLexerStateDefinition {
    regex: RegExp;
    unmatched?: ASTLexerStateNonMatchRule;
    rules: RuntimeLexerStateMatchRule[];
}
