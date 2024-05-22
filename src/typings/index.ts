import { TokenBuffer } from "../lexers/token-buffer";
import { ParserUtility } from "../parser/parser";
import { ASTLexerStateNonMatchRule } from "./ast";
import { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLanguageDefinition, RuntimeLexerStateMatchRule } from "./runtime";
export * from './ast';
export * from './common';
export * from './generator';
export * from './runtime';

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
    regexp: RegExp;
    unmatched?: ASTLexerStateNonMatchRule;
    rules: RuntimeLexerStateMatchRule[];
}
