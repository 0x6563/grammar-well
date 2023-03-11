import { ParserUtility } from "../parser/parser";
import { Dictionary, GrammarRule, GrammarRuleSymbol, LanguageDefinition } from "../typings";
import { Collection, SymbolCollection } from "./general";

export class CanonicalCollection {
    rules: Collection<GrammarRule> = new Collection();
    states: { [key: string]: State } = Object.create(null)
    symbols: SymbolCollection = new SymbolCollection();

    constructor(public grammar: LanguageGrammar) {
        const augmented = { name: Symbol() as unknown as string, symbols: [grammar.start] }
        grammar.rules[augmented.name] = [augmented];
        this.addState([{ rule: augmented, dot: 0 }]);
    }

    addState(seed: StateItem[]) {
        const id = this.encodeStateItems(seed);
        if (id in this.states)
            return this.states[id];

        const state = new State(this, seed);
        this.states[id] = state;
        for (const q in state.queue) {
            this.addState(state.queue[q])
        }
        state.queue = {};
    }

    encodeRule(rule: GrammarRule, dot: number) {
        return this.rules.encode(rule) + '.' + dot;
    }

    encodeStateItems(seed: StateItem[]) {
        return Array.from(new Set(seed)).map(v => this.encodeRule(v.rule, v.dot)).sort().join()
    }
}

class State {
    isFinal = false;

    outputs: StateOut = {
        goto: {},
        action: {}
    };

    queue: { [key: string]: StateItem[] } = {};
    actions: Map<GrammarRuleSymbol, string> = new Map();
    goto: Map<GrammarRuleSymbol, string> = new Map();
    reduce?: GrammarRule;

    constructor(private collection: CanonicalCollection, items: StateItem[]) {
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

        for (const k in this.outputs.goto) {
            const seed = this.outputs.goto[k];
            const stateId = this.collection.encodeStateItems(seed);
            this.queue[stateId] = seed;
            this.goto.set(this.collection.symbols.decode(k), stateId);
        }

        for (const k in this.outputs.action) {
            const seed = this.outputs.action[k];
            const stateId = this.collection.encodeStateItems(seed);
            this.queue[stateId] = seed;
            this.actions.set(this.collection.symbols.decode(k), stateId);
        }
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
            const id = this.collection.symbols.encode(symbol);
            this.outputs.action[id] = this.outputs.action[id] || [];
            this.outputs.action[id].push(stateItem);
        } else {
            const id = this.collection.symbols.encode(symbol);
            this.outputs.goto[id] = this.outputs.goto[id] || [];
            this.outputs.goto[id].push(stateItem);
            for (const rule of this.collection.grammar.rules[symbol as string]) {
                this.closure(rule, 0, visited)
            }
        }
    }
}

export class LRStack {

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

type LanguageGrammar = LanguageDefinition['grammar'];
type StateItem = { rule: GrammarRule, dot: number };

interface StateOut {
    action: Dictionary<StateItem[]>;
    goto: Dictionary<StateItem[]>;
}
