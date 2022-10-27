import { GrammarRule, GrammarRuleSymbol, LanguageDefinition, LexerToken, ParserAlgorithm } from "../typings";
declare const ParserRegistry: {
    [key: string]: ParserAlgorithm;
};
export declare function Parse(language: LanguageDefinition, input: string, options?: ParserOptions): {
    results: any[];
};
export declare class Parser {
    private language;
    private options;
    static Reject: symbol;
    constructor(language: LanguageDefinition, options?: ParserOptions);
    run(input: string): {
        results: any[];
    };
    private getTokenQueue;
    static SymbolMatchesToken(rule: GrammarRuleSymbol, token: LexerToken): boolean;
    static SymbolIsTerminal(rule: GrammarRuleSymbol): boolean;
    static PostProcessGrammarRule(rule: GrammarRule, data: any, meta?: any): any;
}
interface ParserOptions {
    algorithm: (keyof typeof ParserRegistry) | ParserAlgorithm;
    parserOptions?: any;
}
export {};
