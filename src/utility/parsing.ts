import type { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLexerToken } from "../typings/index.ts";

export class ParserUtility {

    static SymbolMatchesToken(symbol: RuntimeGrammarRuleSymbol, token: RuntimeLexerToken) {
        if (typeof symbol === 'string')
            throw 'Attempted to match token against non-terminal';
        if (typeof symbol == 'function')
            return symbol(token);
        if (!symbol)
            return
        if ("test" in symbol)
            return symbol.test(token.value);
        if ("token" in symbol)
            return symbol.token === token.type || token.tag?.has(symbol.token);
        if ("literal" in symbol)
            return symbol.literal === token.value;
    }

    static SymbolIsTerminal(symbol: RuntimeGrammarRuleSymbol) {
        return typeof symbol != 'string';
    }

    static PostProcess(rule: RuntimeGrammarProductionRule, data: any, meta?: any) {
        if (rule.postprocess) {
            return rule.postprocess({ rule, data, meta });
        }
        return data;
    }
}
