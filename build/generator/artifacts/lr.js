import { Collection, GeneratorSymbolCollection } from "../../utility/general.js";
import { CommonGenerator } from "../stringify/common.js";
export class LRParseTableBuilder {
    generator;
    rules = new Collection();
    table = Object.create(null);
    symbols = new GeneratorSymbolCollection();
    constructor(generator) {
        this.generator = generator;
        const augmented = { name: Symbol(), symbols: [{ rule: generator.state.grammar.start }] };
        generator.state.grammar.rules[augmented.name] = [augmented];
        this.addState([{ rule: augmented, dot: 0 }]);
    }
    addState(seed) {
        const id = this.encodeStateItems(seed);
        if (id in this.table)
            return this.table[id];
        const state = new StateBuilder(this, seed);
        this.table[id] = state;
        for (const q in state.queue) {
            this.addState(state.queue[q]);
        }
        state.queue = {};
    }
    encodeRule(rule, dot) {
        return this.rules.encode(rule) + '.' + dot;
    }
    encodeStateItems(seed) {
        return Array.from(new Set(seed)).map(v => this.encodeRule(v.rule, v.dot)).sort().join();
    }
    stringify(depth = 0) {
        const map = {};
        for (const key in this.table) {
            map[key] = this.stringifyState(this.table[key].export(), depth + 1);
        }
        return CommonGenerator.JSON(map, depth);
    }
    stringifyState(state, depth = 0) {
        return CommonGenerator.JSON({
            actions: state.actions.map(v => this.stringifyNext(v, depth + 1)),
            goto: CommonGenerator.JSON(state.goto, depth + 1),
            reduce: state.reduce ? this.generator.grammarRule(state.reduce) : null,
            isFinal: state.isFinal ? 'true' : 'false'
        }, depth);
    }
    stringifyNext(next, depth) {
        return CommonGenerator.JSON({
            symbol: CommonGenerator.SerializeSymbol(next.symbol),
            next: JSON.stringify(next.next)
        }, -1);
    }
}
class StateBuilder {
    collection;
    isFinal = false;
    outputs = {
        goto: {},
        action: {}
    };
    queue = {};
    actions = new Map();
    goto = new Map();
    reduce;
    constructor(collection, items) {
        this.collection = collection;
        const visited = new Set();
        for (const item of items) {
            this.closure(item.rule, item.dot, visited);
        }
        if (this.isFinal) {
            this.reduce = items[0].rule;
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
    closure(rule, dot, visited) {
        const isFinal = rule.symbols.length == dot;
        this.isFinal = isFinal || this.isFinal;
        const symbol = rule.symbols[dot];
        if (isFinal || visited.has(symbol))
            return;
        visited.add(symbol);
        const stateItem = { rule, dot: dot + 1 };
        if (CommonGenerator.SymbolIsTerminal(symbol)) {
            const id = this.collection.symbols.encode(symbol);
            this.outputs.action[id] = this.outputs.action[id] || [];
            this.outputs.action[id].push(stateItem);
        }
        else {
            const id = this.collection.symbols.encode(symbol);
            const name = typeof symbol === 'string' ? symbol : symbol.rule;
            this.outputs.goto[id] = this.outputs.goto[id] || [];
            this.outputs.goto[id].push(stateItem);
            for (const rule of this.collection.generator.state.grammar.rules[name]) {
                this.closure(rule, 0, visited);
            }
        }
    }
    export() {
        const actions = [];
        const goto = {};
        for (const [symbol, next] of this.actions) {
            actions.push({ symbol, next });
        }
        for (const [symbol, next] of this.goto) {
            goto[typeof symbol == 'object' ? symbol.rule : symbol] = JSON.stringify(next);
        }
        return { actions, goto, reduce: this.reduce, isFinal: this.isFinal };
    }
}
//# sourceMappingURL=lr.js.map