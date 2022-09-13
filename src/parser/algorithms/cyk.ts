import { TokenQueue } from "../../lexers/token-queue";
import { GrammarRule, GrammarRuleSymbol, LanguageDefinition, LexerToken } from "../../typings";
import { Parser } from "../parser";

export function CYK(language: LanguageDefinition & { tokens: TokenQueue }, options = {}) {
    const { grammar, tokens } = language;

    const terminals: GrammarRule[] = [];
    const nonTerminals: GrammarRule[] = [];

    for (const name in grammar.rules) {
        for (const rule of grammar.rules[name]) {
            const { symbols } = rule;
            if (Parser.SymbolIsTerminal(symbols[0])) {
                terminals.push(rule);
            } else {
                nonTerminals.push(rule);
            }
        }
    }

    let currentTokenIndex = -1;
    const chart = new Matrix(0, 0, () => new Map<GrammarRuleSymbol, Terminal | NonTerminal>());
    for (const token of tokens) {
        currentTokenIndex++;
        chart.resize(currentTokenIndex + 2, currentTokenIndex + 2);
        for (const rule of terminals) {
            if (Parser.SymbolMatchesToken(rule.symbols[0], token)) {
                chart.get(currentTokenIndex, currentTokenIndex).set(rule.name, { rule, token })
            }
        }


        for (let floor = currentTokenIndex; floor >= 0; floor--) {
            for (let inner = floor; inner <= currentTokenIndex; inner++) {
                const leftCell = chart.get(floor, inner);
                const rightCell = chart.get(inner + 1, currentTokenIndex);

                for (const rule of nonTerminals) {
                    const { symbols: [leftSymbol, rightSymbol] } = rule;
                    const left: Terminal | NonTerminal = leftCell.get(leftSymbol);
                    const right: Terminal | NonTerminal = rightCell.get(rightSymbol);
                    if (left && right) {
                        chart.get(floor, currentTokenIndex).set(rule.name, { rule, left, right });
                    }
                }
            }
        }
    }

    const results = Array.from(chart.get(0, currentTokenIndex).values()).map(v => GetValue(v));
    return { results };
}

function GetValue(ref: Terminal | NonTerminal) {
    if (!ref)
        return;
    if ('token' in ref) {
        return Parser.PostProcessGrammarRule(ref.rule, [ref.token]);
    }
    return Parser.PostProcessGrammarRule(ref.rule, [GetValue(ref.left), GetValue(ref.right)])
}

export interface NonTerminal {
    rule: GrammarRule;
    left: NonTerminal | Terminal;
    right: NonTerminal | Terminal;
}

export interface Terminal {
    rule: GrammarRule;
    token: LexerToken;
}

export class Matrix<T> {
    private $x = 0;
    private $y = 0;
    get x() { return this.$x }
    set x(x: number) { x != this.$x && this.resize(x, this.y); }
    get y() { return this.$y }
    set y(y: number) { y != this.$y && this.resize(this.x, y); }

    matrix: GetCallbackOrValue<T>[][] = [];

    constructor(x: number, y: number, private initial?: T | ((...args: any) => T)) {
        this.resize(x, y);
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
            this.$x = x;
        }
        if (y > this.y) {
            this.matrix.forEach(a => a.push(...Matrix.Array(y - a.length, this.initial)));
            this.$y = y;
        } else if (y < this.y) {
            this.matrix.forEach(a => a.splice(y + 1));
            this.$y = y;
        }
        if (x > this.x) {
            const ext = Matrix.Array(x - this.x, () => Matrix.Array(this.y, this.initial))
            this.matrix.push(...ext);
            this.$x = x;
        }
    }

    static Array<T>(length, initial?: T | ((...args: any) => T)): GetCallbackOrValue<T>[] {
        return Array.from({ length }, (typeof initial == 'function' ? initial : () => initial) as any);
    }
}

type GetCallbackOrValue<T> = T extends (...args: any) => any ? ReturnType<T> : T;