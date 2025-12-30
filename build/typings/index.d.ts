import type { TokenBuffer } from "../lexers/token-buffer.ts";
import type { ParserUtility } from "../utility/parsing.ts";
import type { ASTLexerStateNonMatchRule } from "./ast.ts";
import type { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeParserClass, RuntimeLexerStateMatchRule } from "./runtime.ts";
export * from './ast.ts';
export * from './common.ts';
export * from './generator.ts';
export * from './runtime.ts';
export interface ImportResolver {
    path(path: string): string;
    body(path: string): Promise<string>;
}
export interface ImportResolverConstructor {
    new (basePath: string): ImportResolver;
}
export type ParserAlgorithm = ((language: RuntimeParserClass & {
    tokens: TokenBuffer;
    utility: ParserUtility;
}, options?: any) => {
    results: any[];
    info?: any;
});
export interface LRState {
    actions: Next[];
    goto: {
        [key: string]: string;
    };
    reduce?: RuntimeGrammarProductionRule;
    isFinal: boolean;
}
type Next = {
    symbol: RuntimeGrammarRuleSymbol;
    next: string;
};
export interface TQRestorePoint {
    historyIndex: number;
    offset: number;
}
export interface StatefulLexerStateDefinition {
    regex: RegExp;
    unmatched?: ASTLexerStateNonMatchRule;
    rules: RuntimeLexerStateMatchRule[];
}
