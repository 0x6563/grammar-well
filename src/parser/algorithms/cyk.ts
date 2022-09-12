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
                if (Parser.SymbolIsTerminal(symbol)) {
                    terminals.set(symbol, rule);
                } else {
                    nonTerminals.set(symbol as string, rule);
                }
            }
        }
    }

    let currentTokenIndex = -1;
    const chart = new Matrix(0, 0, () => new Set<string>());
    for (const token of language.tokens) {
        currentTokenIndex++;
        chart.resize(currentTokenIndex + 1, currentTokenIndex + 1);
        for (const name in grammar.rules) {
            for (const rule of grammar.rules[name]) {
                if (Parser.SymbolIsTerminal(rule.symbols[0]) && Parser.SymbolMatchesToken(rule.symbols[0], token)) {
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

    console.log(JSON.stringify(chart, (_key, value) => (value instanceof Set ? [...value] : value)), 2);
    return { results: [chart.get(0, currentTokenIndex).size != 0] };
}

export class Matrix<T> {
    get x() { return this.matrix.length; }
    set x(x: number) { this.resize(x, this.y); }
    get y() { return this.matrix[0]?.length || 0; }
    set y(y: number) { this.resize(this.x, y); }

    matrix: GetCallbackOrValue<T>[][];

    constructor(x: number, y: number, private value?: T | ((...args: any) => T)) {
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
        }
        if (y > this.y) {
            this.matrix.forEach(a => a.push(...Matrix.CreateArray(y - this.y, this.value)));
        } else if (y < this.y) {
            this.matrix.forEach(a => a.splice(y + 1));
        }
        if (x > this.x) {
            const ext = Matrix.CreateArray(x - this.x, () => Matrix.CreateArray(y, this.value))
            this.matrix.push(...ext);
        }
    }

    static CreateArray<T>(length, value?: T | ((...args: any) => T)): GetCallbackOrValue<T>[] {
        return Array.from({ length }, (typeof value == 'function' ? value : () => value) as any);
    }
}

type GetCallbackOrValue<T> = T extends (...args: any) => any ? ReturnType<T> : T;