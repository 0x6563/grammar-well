import { TokenBuffer } from "../../lexers/token-buffer";
import { GrammarRule, GrammarRuleSymbol, LanguageDefinition } from "../../typings";
import { ParserUtility } from "../parser";

export function LR0(language: LanguageDefinition & { tokens: TokenBuffer }, options = {}) {
    const { grammar, tokens } = language;
    const collection = new CanonicalCollection(grammar);
    const stack = new LRStack();
    const s = collection.states.get('0.0');
    stack.append(s.rule.name);
    stack.shift(s);
    let token;

    while (token = tokens.next()) {
        for (const [symbol, state] of stack.current.state.actions) {
            if (ParserUtility.SymbolMatchesToken(symbol, token)) {
                stack.append(symbol);
                stack.shift(collection.states.get(state));
                stack.current.value = token;
                break;
            }
        }
        while (stack.current.state?.isFinal) {
            const rule = collection.rules.getItem(stack.current.state.reduce);
            stack.reduce(rule);
            stack.current.value = ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous.state.goto.get(rule.name);
            stack.shift(collection.states.get(s));

        }
    }

    return { results: [stack.current.value] }
}

class Node {
    children: Node[] = [];
    state: State;
    symbol: GrammarRuleSymbol;
    rule: GrammarRule;
    value: any;
}

class LRStack {

    stack: Node[] = [];

    get current() {
        return this.stack[this.stack.length - 1];
    }

    get previous() {
        return this.stack[this.stack.length - 2];
    }


    shift(state: State) {
        this.current.state = state;
    }

    reduce(rule: GrammarRule) {
        const n = new Node();
        const l = rule.symbols.length;
        n.children = this.stack.splice(l * -1, l);
        n.children.forEach(v => delete v.state);
        n.rule = rule;
        n.symbol = rule.name;
        this.stack.push(n);
    }

    append(symbol: GrammarRuleSymbol) {
        this.stack.push(new Node())
        this.current.symbol = symbol;
    }
}

class CanonicalCollection {
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


class State {
    items: { rule: GrammarRule, dot: number }[] = [];
    isFinal = false;
    actions: Map<GrammarRuleSymbol, string> = new Map();
    goto: Map<GrammarRuleSymbol, string> = new Map();
    reduce: number;

    constructor(
        grammar: LanguageDefinition['grammar'],
        public rule: GrammarRule,
        dot: number
    ) {
        if (rule.symbols.length == dot)
            this.isFinal = true;
        this.addClosure(grammar, rule, dot);
    }

    private addClosure(grammar: LanguageDefinition['grammar'], rule: GrammarRule, dot: number, visited: Set<GrammarRuleSymbol> = new Set()) {
        const symbol = rule.symbols[dot];
        if (visited.has(symbol))
            return;
        visited.add(symbol);
        this.items.push({ rule, dot });

        if (!ParserUtility.SymbolIsTerminal(symbol)) {
            grammar
                .rules[symbol as string]
                .forEach(v => this.addClosure(grammar, v, 0, visited));
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