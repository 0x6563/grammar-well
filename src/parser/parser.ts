import { CharacterLexer } from "../lexers/character-lexer";
import { StatefulLexer } from "../lexers/stateful-lexer";
import { TokenBuffer } from "../lexers/token-buffer";
import { GrammarRule, GrammarRuleSymbol, LanguageDefinition, LexerToken, ParserAlgorithm } from "../typings";
import { CYK } from "./algorithms/cyk";
import { Earley } from "./algorithms/earley";
import { LR } from "./algorithms/lr";

const ParserRegistry: { [key: string]: ParserAlgorithm } = {
    earley: Earley,
    cyk: CYK,
    lr0: LR
}

export function Parse(language: LanguageDefinition, input: string, options?: ParserOptions) {
    const i = new Parser(language, options);
    return i.run(input);
}

export class Parser {
    static Reject = Symbol();

    constructor(private language: LanguageDefinition, private options: ParserOptions = { algorithm: 'earley', parserOptions: {} }) { }

    run(input: string): { results: any[] } {
        const tokenQueue = this.getTokenQueue();
        tokenQueue.feed(input);
        if (typeof this.options.algorithm == 'function')
            return this.options.algorithm({ ...this.language, tokens: tokenQueue }, this.options.parserOptions);
        return ParserRegistry[this.options.algorithm]({ ...this.language, tokens: tokenQueue }, this.options.parserOptions);
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

    static SymbolMatchesToken(rule: GrammarRuleSymbol, token: LexerToken) {
        if (typeof rule === 'string')
            throw 'Attempted to match token against non-terminal';
        if (typeof rule == 'function')
            return rule(token);
        if (!rule)
            return
        if ("test" in rule)
            return rule.test(token.value);
        if ("token" in rule)
            return rule.token === token.type || token.tag?.has(rule.token);
        if ("literal" in rule)
            return rule.literal === token.value;
    }

    static SymbolIsTerminal(rule: GrammarRuleSymbol) {
        return typeof rule != 'string';
    }

    static PostProcessGrammarRule(rule: GrammarRule, data: any, meta?: any) {
        if (rule.postprocess) {
            return rule.postprocess({
                rule,
                data,
                meta,
                reject: Parser.Reject
            });
        }
        return data;
    }
}

interface ParserOptions {
    algorithm: (keyof typeof ParserRegistry) | ParserAlgorithm,
    parserOptions?: any;
}