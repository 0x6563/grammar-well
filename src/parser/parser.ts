import { ParserAlgorithm, RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLanguageDefinition, RuntimeLexerToken } from "../typings/index.js";
import { CharacterLexer } from "../lexers/character-lexer.js";
import { StatefulLexer } from "../lexers/stateful-lexer.js";
import { TokenBuffer } from "../lexers/token-buffer.js";
import { CYK } from "./algorithms/cyk.js";
import { Earley } from "./algorithms/earley.js";
import { LRK } from "./algorithms/lrk/algorithm.js";

const ParserRegistry: { [key: string]: ParserAlgorithm } = {
    earley: Earley,
    cyk: CYK,
    lr0: LRK
}

export function Parse(
    language: RuntimeLanguageDefinition,
    input: string,
    options: ParserOptions = {
        algorithm: 'earley',
        parserOptions: {}
    },
    results: 'full' | 'first' = 'first'
) {
    const tokenizer = GetTokenizer(language);
    tokenizer.feed(input);
    const algorithm = typeof options.algorithm == 'function' ? options.algorithm : ParserRegistry[options.algorithm];
    const result = algorithm({ ...language, tokens: tokenizer, utility: ParserUtility }, options.parserOptions);
    return results == 'full' ? result : result.results[0];
}

function GetTokenizer({ lexer }: RuntimeLanguageDefinition) {
    if (!lexer) {
        return new TokenBuffer(new CharacterLexer());
    } else if ("feed" in lexer && typeof lexer.feed == 'function') {
        return new TokenBuffer(lexer);
    } else if ('states' in lexer) {
        return new TokenBuffer(new StatefulLexer(lexer));
    }
}

 

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

interface ParserOptions {
    algorithm: (keyof typeof ParserRegistry) | ParserAlgorithm,
    parserOptions?: any;
}
