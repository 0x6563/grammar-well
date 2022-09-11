import { TokenQueue } from "../../lexers/token-queue";
import { GrammarRule, GrammarRuleSymbol, LanguageDefinition } from "../../typings";
import { Parser } from "../parser";

export function CYK(language: LanguageDefinition & { tokens: TokenQueue }, options = {}) {
    const { grammar } = language;

    const terminals = new Map<GrammarRuleSymbol, GrammarRule>();
    const nonTerminals = new Map<string, GrammarRule>();
    for (const name in grammar.rules) {
        for (const rule of grammar.rules[name]) {
            const { symbols } = rule;
            for (const symbol of symbols) {
                if (typeof symbol != 'string') {
                    terminals.set(symbol, rule);
                } else {
                    nonTerminals.set(symbol, rule);
                }
            }
        }
    }

    const tokens = [];
    for (const token of language.tokens) {
        tokens.push(token);
    }

    const totalTokens = tokens.length;
    const chart = new Matrix<Set<string>>(totalTokens, totalTokens, () => new Set<string>());

    for (let currentTokenIndex = 0; currentTokenIndex < totalTokens; currentTokenIndex++) {
        for (const name in grammar.rules) {
            for (const rule of grammar.rules[name]) {
                if (Parser.SymbolIsTerminal(rule.symbols[0]) && Parser.SymbolMatchesToken(rule.symbols[0], tokens[currentTokenIndex])) {
                    chart.get(currentTokenIndex, currentTokenIndex).add(name)
                }
            }
        }


        for (let floor = currentTokenIndex - 1; floor >= 0; floor--) {
            for (let inner = floor; inner <= currentTokenIndex; inner++) {
                for (const name in grammar.rules) {
                    const rule = grammar.rules[name];
                    for (const r of rule) {
                        const { symbols } = r;
                        if (symbols.length === 2 && chart.get(floor, inner).has(symbols[0] as string) && chart.get(inner + 1, currentTokenIndex).has(symbols[1] as string)) {
                            chart.get(floor, currentTokenIndex).add(name);
                        }
                    }
                }
            }
        }
    }

    console.log(chart);
    return { results: [chart.get(0, totalTokens - 1).size != 0] };
}

export class Matrix<T> {
    matrix: T[][];
    constructor(public x: number, public y: number, private value?: CallbackOrValue) {
        this.matrix = Matrix.CreateArray(x, () => Matrix.CreateArray(y, value))
    }

    get(x: number, y: number): T {
        return this.matrix[x][y];
    }

    set(x: number, y: number, value: any) {
        return this.matrix[x][y] = value;
    }

    resize(x: number, y: number) {
        if (x < this.x) {
            this.matrix.splice(x);
            this.x = x;
        }
        if (y > this.y) {
            this.matrix.forEach(a => a.push(...Matrix.CreateArray(y - this.y, this.value)));
        } else if (y < this.y) {
            this.matrix.forEach(a => a.splice(y + 1));
        }
        this.y = y;
        if (x > this.x) {
            const ext = Matrix.CreateArray(x - this.x, () => Matrix.CreateArray(this.y, this.value))
            this.matrix.push(...ext);
        }
    }

    static CreateArray<T extends CallbackOrValue>(length, value?: T): GetCallbackOrValue<T>[] {
        return Array.from({ length }, (typeof value == 'function' ? value : () => value) as any);
    }
}

type GetCallbackOrValue<T> = T extends (...args: any) => any ? ReturnType<T> : T;
type CallbackOrValue = ((...args: any) => any) | any | any[];