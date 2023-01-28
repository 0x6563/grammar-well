import { TokenBuffer } from "../../lexers/token-buffer";
import { Dictionary, GrammarRule, GrammarRuleSymbol, LanguageDefinition } from "../../typings";
import { ParserUtility } from "../parser";

export function LR0(language: LanguageDefinition & { tokens: TokenBuffer }, options = {}) {
    const { grammar, tokens } = language;
    const collection = new CanonicalCollection(grammar);
    const stack = new LRStack();
    const s = collection.states.get('0.0');
    stack.add(null);
    stack.shift(s);
    let token;

    while (token = tokens.next()) {
        for (const [symbol, state] of stack.current.state.actions) {
            if (ParserUtility.SymbolMatchesToken(symbol, token)) {
                stack.add(symbol);
                stack.shift(collection.states.get(state));
                stack.current.value = token;
                break;
            }
        }

        while (stack.current.state?.isFinal) {
            const rule = stack.current.state.reduce;
            stack.reduce(rule);
            stack.current.value = ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous.state.goto.get(rule.name);
            stack.shift(collection.states.get(s));

        }
    }

    return { results: [stack.current.value] }
}

class LRStack {

    stack: LRStackItem[] = [];

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
        const n = new LRStackItem();
        const l = rule.symbols.length;
        n.children = this.stack.splice(l * -1, l);
        n.children.forEach(v => delete v.state);
        n.rule = rule;
        n.symbol = rule.name;
        this.stack.push(n);
    }

    add(symbol: GrammarRuleSymbol) {
        this.stack.push(new LRStackItem())
        this.current.symbol = symbol;
    }
}


class LRStackItem {
    children: LRStackItem[] = [];
    state: State;
    symbol: GrammarRuleSymbol;
    rule: GrammarRule;
    value: any;
}

class CanonicalCollection {
    rules: IdMap<GrammarRule> = new IdMap();
    states: Map<string, State> = new Map();

    constructor(public grammar: LanguageGrammar) {
        const augment: any = Symbol();
        const augmented = { name: augment, symbols: [grammar.start] }
        grammar['rules'][augment] = [augmented];
        this.rules.getId(augmented);
        this.addState([{ rule: grammar['rules'][augment][0], dot: 0 }]);
    }

    addState(seed: StateItem[]) {
        const id = this.getStateId(seed);
        if (this.states.has(id))
            return this.states.get(id);

        const state = new State(this, seed);
        this.states.set(id, state);
        for (const q in state.queue) {
            this.addState(state.queue[q])
        }
        state.queue = {};
    }

    getRuleId(rule: GrammarRule, dot: number) {
        return this.rules.getId(rule) + '.' + dot;
    }

    getStateId(seed: StateItem[]) {
        return Array.from(new Set(seed)).map(v => this.getRuleId(v.rule, v.dot)).sort().join()
    }
}

class State {
    isFinal = false;

    outputs: StateOut = {
        nonTerminals: {},
        other: new Map(),
        literalI: {},
        literalS: {},
        token: {},
    };

    queue: { [key: string]: StateItem[] } = {};
    actions: Map<GrammarRuleSymbol, string> = new Map();
    goto: Map<GrammarRuleSymbol, string> = new Map();
    reduce?: GrammarRule;

    constructor(private context: CanonicalCollection, items: StateItem[]) {
        const visited = new Set<GrammarRuleSymbol>();
        for (const item of items) {
            this.closure(item.rule, item.dot, visited);
        }
        if (this.isFinal) {
            if (items.length == 1 && visited.size < 1) {
                this.reduce = items[0].rule;
            } else {
                throw 'Conflict Detected';
            }
        }

        for (const k in this.outputs.nonTerminals) {
            const v = this.outputs.nonTerminals[k];
            const stateId = this.context.getStateId(v);
            this.queue[stateId] = v;
            this.goto.set(k, stateId);
        }

        for (const k in this.outputs.token) {
            const v = this.outputs.token[k];
            this.addAction({ token: k }, v);
        }

        for (const k in this.outputs.literalI) {
            const v = this.outputs.literalI[k];
            this.addAction({ literal: k, insensitive: true }, v);
        }

        for (const k in this.outputs.literalS) {
            const v = this.outputs.literalS[k];
            this.addAction({ literal: k, insensitive: false }, v);
        }

        for (const [k, v] of this.outputs.other) {
            this.addAction(k, v);
        }

    }

    private addAction(symbol: GrammarRuleSymbol, seed: StateItem[]) {
        const stateId = this.context.getStateId(seed);
        this.queue[stateId] = seed;
        this.actions.set(symbol, stateId);
    }

    private closure(rule: GrammarRule, dot: number, visited: Set<GrammarRuleSymbol>) {
        const isFinal = rule.symbols.length == dot;
        this.isFinal = isFinal || this.isFinal;
        const { [dot]: symbol } = rule.symbols;

        if (isFinal || visited.has(symbol))
            return;

        visited.add(symbol);
        const stateItem = { rule, dot: dot + 1 };

        if (ParserUtility.SymbolIsTerminal(symbol)) {
            const s = symbol as Exclude<GrammarRuleSymbol, string>;
            if ('literal' in s) {
                InitAppendArray(s.insensitive ? this.outputs.literalI : this.outputs.literalS, s.literal, stateItem);
            } else if ('token' in s) {
                InitAppendArray(this.outputs.token, s.token, stateItem);
            } else {
                if (!this.outputs.other.has(s)) {
                    this.outputs.other.set(s, []);
                }
                this.outputs.other.get(s).push(stateItem);
            }
        } else {
            InitAppendArray(this.outputs.nonTerminals, symbol as string, stateItem);
            for (const rule of this.context.grammar.rules[symbol as string]) {
                this.closure(rule, 0, visited)
            }
        }
    }
}

function InitAppendArray<T extends { [key: string]: StateItem[] }>(obj: T, key: keyof T, item: StateItem) {
    (obj as any)[key as keyof T] = obj[key] || [];
    obj[key].push(item);
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

type LanguageGrammar = LanguageDefinition['grammar'];
type StateItem = { rule: GrammarRule, dot: number };

interface StateOut {
    other: Map<GrammarRuleSymbol, StateItem[]>;
    nonTerminals: Dictionary<StateItem[]>;
    literalI: Dictionary<StateItem[]>;
    literalS: Dictionary<StateItem[]>;
    token: Dictionary<StateItem[]>;
} 