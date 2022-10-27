import { TokenBuffer } from "../../lexers/token-buffer";
import { GrammarRule, GrammarRuleSymbol, LanguageDefinition } from "../../typings";
import { Parse, Parser } from "../parser";

export function LR(language: LanguageDefinition & { tokens: TokenBuffer }, options = {}) {
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
    const table = new ParsingTable(grammar);
    // console.log(table);
    return { results: [] }
}


class ParsingTable {
    states: any[] = [];
    symbolIds: IdMap<GrammarRuleSymbol | string> = new IdMap();
    ruleIds: IdMap<GrammarRule | string> = new IdMap();
    stateIds: Map<string, number> = new Map();
    queue: GrammarRule[] = [];

    constructor(private grammar: LanguageDefinition['grammar']) {
        this.queue.push({ name: 'S\'', symbols: [grammar.start] });
        let item: GrammarRule;
        while (item = this.queue.shift()) {
            this.addRule(item);
        }
        // console.log(JSON.stringify(this.states, null, 2));
    }

    addRule(rule: GrammarRule) {
        if (this.ruleIds.map.has(rule))
            return;

        for (let i = 0; i <= rule.symbols.length; i++) {
            this.getStateId(rule, i);
            const symbol = rule.symbols[i];
            if (symbol && !Parser.SymbolIsTerminal(symbol)) {
                const subs = this.grammar.rules[symbol as string];
                this.queue.push(...this.grammar.rules[symbol as string]);
            }
        }
    }

    getStateId(rule: GrammarRule, dot: number) {
        const composite = this.ruleIds.getId(dot === 0 ? rule.name : rule) + '.' + dot;
        if (!this.stateIds.has(composite)) {
            this.states.push({ rule, dot })
            this.stateIds.set(composite, this.states.length - 1);
        }
        return this.stateIds.get(composite);

    }
}

class IdMap<T>{
    private id = 0;

    map: Map<T, number> = new Map();

    getId(ref: T) {
        if (!this.map.has(ref)) {
            this.map.set(ref, this.id++);
        }
        return this.map.get(ref);
    }
}