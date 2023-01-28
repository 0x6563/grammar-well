"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LR0 = void 0;
const parser_1 = require("../parser");
function LR0(language, options = {}) {
    var _a;
    const { grammar, tokens } = language;
    const collection = new CanonicalCollection(grammar);
    const stack = new LRStack();
    const s = collection.states.get('0.0');
    stack.add(null);
    stack.shift(s);
    let token;
    while (token = tokens.next()) {
        for (const [symbol, state] of stack.current.state.actions) {
            if (parser_1.ParserUtility.SymbolMatchesToken(symbol, token)) {
                stack.add(symbol);
                stack.shift(collection.states.get(state));
                stack.current.value = token;
                break;
            }
        }
        while ((_a = stack.current.state) === null || _a === void 0 ? void 0 : _a.isFinal) {
            const rule = stack.current.state.reduce;
            stack.reduce(rule);
            stack.current.value = parser_1.ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous.state.goto.get(rule.name);
            stack.shift(collection.states.get(s));
        }
    }
    return { results: [stack.current.value] };
}
exports.LR0 = LR0;
class LRStack {
    constructor() {
        this.stack = [];
    }
    get current() {
        return this.stack[this.stack.length - 1];
    }
    get previous() {
        return this.stack[this.stack.length - 2];
    }
    shift(state) {
        this.current.state = state;
    }
    reduce(rule) {
        const n = new LRStackItem();
        const l = rule.symbols.length;
        n.children = this.stack.splice(l * -1, l);
        n.children.forEach(v => delete v.state);
        n.rule = rule;
        n.symbol = rule.name;
        this.stack.push(n);
    }
    add(symbol) {
        this.stack.push(new LRStackItem());
        this.current.symbol = symbol;
    }
}
class LRStackItem {
    constructor() {
        this.children = [];
    }
}
class CanonicalCollection {
    constructor(grammar) {
        this.grammar = grammar;
        this.rules = new IdMap();
        this.states = new Map();
        const augment = Symbol();
        const augmented = { name: augment, symbols: [grammar.start] };
        grammar['rules'][augment] = [augmented];
        this.rules.getId(augmented);
        this.addState([{ rule: grammar['rules'][augment][0], dot: 0 }]);
    }
    addState(seed) {
        const id = this.getStateId(seed);
        if (this.states.has(id))
            return this.states.get(id);
        const state = new State(this, seed);
        this.states.set(id, state);
        for (const q in state.queue) {
            this.addState(state.queue[q]);
        }
        state.queue = {};
    }
    getRuleId(rule, dot) {
        return this.rules.getId(rule) + '.' + dot;
    }
    getStateId(seed) {
        return Array.from(new Set(seed)).map(v => this.getRuleId(v.rule, v.dot)).sort().join();
    }
}
class State {
    constructor(context, items) {
        this.context = context;
        this.isFinal = false;
        this.outputs = {
            nonTerminals: {},
            other: new Map(),
            literalI: {},
            literalS: {},
            token: {},
        };
        this.queue = {};
        this.actions = new Map();
        this.goto = new Map();
        const visited = new Set();
        for (const item of items) {
            this.closure(item.rule, item.dot, visited);
        }
        if (this.isFinal) {
            if (items.length == 1 && visited.size < 1) {
                this.reduce = items[0].rule;
            }
            else {
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
    addAction(symbol, seed) {
        const stateId = this.context.getStateId(seed);
        this.queue[stateId] = seed;
        this.actions.set(symbol, stateId);
    }
    closure(rule, dot, visited) {
        const isFinal = rule.symbols.length == dot;
        this.isFinal = isFinal || this.isFinal;
        const { [dot]: symbol } = rule.symbols;
        if (isFinal || visited.has(symbol))
            return;
        visited.add(symbol);
        const stateItem = { rule, dot: dot + 1 };
        if (parser_1.ParserUtility.SymbolIsTerminal(symbol)) {
            const s = symbol;
            if ('literal' in s) {
                InitAppendArray(s.insensitive ? this.outputs.literalI : this.outputs.literalS, s.literal, stateItem);
            }
            else if ('token' in s) {
                InitAppendArray(this.outputs.token, s.token, stateItem);
            }
            else {
                if (!this.outputs.other.has(s)) {
                    this.outputs.other.set(s, []);
                }
                this.outputs.other.get(s).push(stateItem);
            }
        }
        else {
            InitAppendArray(this.outputs.nonTerminals, symbol, stateItem);
            for (const rule of this.context.grammar.rules[symbol]) {
                this.closure(rule, 0, visited);
            }
        }
    }
}
function InitAppendArray(obj, key, item) {
    obj[key] = obj[key] || [];
    obj[key].push(item);
}
class IdMap {
    constructor() {
        this.map = new Map();
        this.items = [];
    }
    getId(ref) {
        if (!this.map.has(ref)) {
            this.map.set(ref, this.items.length);
            this.items.push(ref);
        }
        return this.map.get(ref);
    }
    getItem(ref) {
        return this.items[ref];
    }
}
//# sourceMappingURL=lr0.js.map