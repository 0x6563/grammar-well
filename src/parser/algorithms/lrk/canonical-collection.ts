import { GrammarRule, LanguageDefinition } from "../../../typings";
import { ParserUtility } from "../../parser";
import { State } from "./state";

export class CanonicalCollection {
    rules: IdMap<GrammarRule> = new IdMap();
    states: Map<string, State> = new Map();

    constructor(public grammar: LanguageDefinition['grammar']) {
        const augment: any = Symbol();
        const augmented = { name: augment, symbols: [grammar.start] }
        grammar['rules'][augment] = [augmented];
        this.rules.getId(augmented);
        this.addState(grammar['rules'][augment][0], 0);
        this.linkStates('0.0', new Set());
    }

    addState(rule: GrammarRule, dot: number) {
        const id = this.getStateId(rule, dot);
        if (this.states.has(id))
            return;

        const state = new State(this.grammar, rule, dot);

        this.states.set(id, state);

        if (!state.isFinal)
            for (let i = 0; i < state.items.length; i++) {
                const item = state.items[i];
                this.addState(item.rule, item.dot + 1);
            }
    }

    getStateId(rule: GrammarRule, dot: number) {
        return this.rules.getId(rule) + '.' + dot;
    }


    linkStates(id: string, completed: Set<string>) {
        completed.add(id);
        const state = this.states.get(id);
        if (!state.isFinal) {
            for (let i = 0; i < state.items.length; i++) {
                const item = state.items[i];
                const symbol = item.rule.symbols[item.dot];
                const itemStateId = this.getStateId(item.rule, item.dot + 1);
                if (ParserUtility.SymbolIsTerminal(symbol) && typeof symbol != 'symbol') {
                    state.actions.set(symbol, itemStateId);
                } else {
                    state.goto.set(symbol, itemStateId);
                }
                if (!completed.has(itemStateId))
                    this.linkStates(itemStateId, completed);
            }
        } else {
            state.reduce = this.rules.getId(state.rule);
        }
    }
}


class IdMap<T>{

    map: Map<T, number> = new Map();
    private items: T[] = [];

    getId(ref: T) {
        if (!this.map.has(ref)) {
            this.map.set(ref, this.items.length);
            this.items.push(ref);
        }

        return this.map.get(ref);
    }

    getItem(ref: number) {
        return this.items[ref];
    }
}