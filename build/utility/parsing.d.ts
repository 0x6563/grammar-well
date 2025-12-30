import type { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLexerToken } from "../typings/index.ts";
export declare class ParserUtility {
    static SymbolMatchesToken(symbol: RuntimeGrammarRuleSymbol, token: RuntimeLexerToken): boolean;
    static SymbolIsTerminal(symbol: RuntimeGrammarRuleSymbol): symbol is RegExp | import("../index.ts").ASTGrammarSymbolLiteral | import("../index.ts").ASTGrammarSymbolToken | ((data: RuntimeLexerToken) => boolean);
    static PostProcess(rule: RuntimeGrammarProductionRule, data: any, meta?: any): any;
}
