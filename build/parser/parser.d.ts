import { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLanguageDefinition, RuntimeLexerToken, ParserAlgorithm } from "../typings";
declare const ParserRegistry: {
    [key: string]: ParserAlgorithm;
};
export declare function Parse(language: RuntimeLanguageDefinition, input: string, options?: ParserOptions): {
    results: any[];
};
export declare class Parser {
    private language;
    private options;
    constructor(language: RuntimeLanguageDefinition, options?: ParserOptions);
    run(input: string): {
        results: any[];
    };
    private getTokenQueue;
}
export declare abstract class ParserUtility {
    static SymbolMatchesToken(symbol: RuntimeGrammarRuleSymbol, token: RuntimeLexerToken): boolean;
    static SymbolIsTerminal(symbol: RuntimeGrammarRuleSymbol): boolean;
    static PostProcess(rule: RuntimeGrammarProductionRule, data: any, meta?: any): any;
}
interface ParserOptions {
    algorithm: (keyof typeof ParserRegistry) | ParserAlgorithm;
    parserOptions?: any;
}
export {};
