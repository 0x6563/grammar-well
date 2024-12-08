import { ParserAlgorithm, RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLanguageDefinition, RuntimeLexerToken } from "../typings/index.js";
declare const ParserRegistry: {
    [key: string]: ParserAlgorithm;
};
export declare function Parse(language: RuntimeLanguageDefinition, input: string, options?: ParserOptions, results?: 'full' | 'first'): any;
export declare class ParserUtility {
    static SymbolMatchesToken(symbol: RuntimeGrammarRuleSymbol, token: RuntimeLexerToken): boolean;
    static SymbolIsTerminal(symbol: RuntimeGrammarRuleSymbol): boolean;
    static PostProcess(rule: RuntimeGrammarProductionRule, data: any, meta?: any): any;
}
interface ParserOptions {
    algorithm: (keyof typeof ParserRegistry) | ParserAlgorithm;
    parserOptions?: any;
}
export {};
