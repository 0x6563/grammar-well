import { CharacterLexer } from "../lexers/character-lexer";
import { StatefulLexer } from "../lexers/stateful-lexer";
import { TokenBuffer } from "../lexers/token-buffer";
import { GrammarRule, GrammarRuleSymbol, LanguageDefinition, LexerToken, ParserAlgorithm } from "../typings";
import { CYK } from "./algorithms/cyk";
import { Earley } from "./algorithms/earley";
import { LR0 } from "./algorithms/lr0";

const ParserRegistry: { [key: string]: ParserAlgorithm } = {
    earley: Earley,
    cyk: CYK,
    lr0: LR0
}

export function Parse(language: LanguageDefinition, input: string, options?: ParserOptions) {
    const i = new Parser(language, options);
    return i.run(input);
}

export class Parser {

    constructor(private language: LanguageDefinition, private options: ParserOptions = { algorithm: 'earley', parserOptions: {} }) { }

    run(input: string): { results: any[] } {
        const tokenQueue = this.getTokenQueue();
        tokenQueue.feed(input);
        if (typeof this.options.algorithm == 'function')
            return this.options.algorithm({ ...this.language, tokens: tokenQueue, utility: ParserUtility }, this.options.parserOptions);
        return ParserRegistry[this.options.algorithm]({ ...this.language, tokens: tokenQueue, utility: ParserUtility }, this.options.parserOptions);
    }

    private getTokenQueue() {
        const { lexer } = this.language;
        if (!lexer) {
            return new TokenBuffer(new CharacterLexer());
        } else if ("feed" in lexer && typeof lexer.feed == 'function') {
            return new TokenBuffer(lexer);
        } else if ('states' in lexer) {
            return new TokenBuffer(new StatefulLexer(lexer));
        }
    }
}


export abstract class ParserUtility {

    static SymbolMatchesToken(symbol: GrammarRuleSymbol, token: LexerToken) {
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

    static SymbolIsTerminal<T extends GrammarRuleSymbol>(symbol: T) {
        return typeof symbol != 'string';
    }

    static PostProcess(rule: GrammarRule, data: any, meta?: any) {
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