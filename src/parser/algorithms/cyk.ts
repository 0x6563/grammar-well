import { TokenBuffer } from "../../lexers/token-buffer";
import { GrammarRule, GrammarRuleSymbol, LanguageDefinition, LexerToken } from "../../typings";
import { Matrix } from "../../utility/general";
import { ParserUtility } from "../parser";

export function CYK(language: LanguageDefinition & { tokens: TokenBuffer }, _options = {}) {
    const { grammar, tokens } = language;

    const terminals: GrammarRule[] = [];
    const nonTerminals: GrammarRule[] = [];

    for (const name in grammar.rules) {
        for (const rule of grammar.rules[name]) {
            const { symbols } = rule;
            if (ParserUtility.SymbolIsTerminal(symbols[0])) {
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
            if (ParserUtility.SymbolMatchesToken(rule.symbols[0], token)) {
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
        return ParserUtility.PostProcess(ref.rule, [ref.token]);
    }
    return ParserUtility.PostProcess(ref.rule, [GetValue(ref.left), GetValue(ref.right)])
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
