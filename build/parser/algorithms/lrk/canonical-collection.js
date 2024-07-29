import { ParserUtility } from "../../../utility/parsing.js";
import { BiMap } from "./bimap.js";
import { ClosureBuilder } from "./closure.js";
export class CanonicalCollection {
    grammar;
    states = new Map();
    rules = new BiMap();
    terminals = new BiMap();
    closure;
    constructor(grammar) {
        this.grammar = grammar;
        const augmented = {
            name: Symbol(),
            symbols: [this.grammar.start]
        };
        this.grammar['rules'][augmented.name] = [augmented];
        this.closure = new ClosureBuilder(this.grammar);
        this.rules.id(augmented);
        this.addState(this.grammar['rules'][augmented.name][0], 0);
        this.linkStates('0.0');
    }
    addState(rule, dot) {
        const id = this.getStateId(rule, dot);
        if (this.states.has(id))
            return;
        const state = {
            items: [],
            isFinal: false,
            actions: new Map(),
            goto: new Map(),
            reduce: null,
            rule: rule
        };
        state.items.push({ rule, dot });
        if (rule.symbols.length == dot)
            state.isFinal = true;
        this.states.set(id, state);
        state.items.push(...this.closure.get(rule.symbols[dot]));
        if (!state.isFinal)
            for (const { rule, dot } of state.items) {
                this.addState(rule, dot + 1);
            }
    }
    linkStates(id, completed = new Set()) {
        completed.add(id);
        const state = this.states.get(id);
        if (!state.isFinal) {
            for (const { rule, dot } of state.items) {
                const symbol = rule.symbols[dot];
                const itemStateId = this.getStateId(rule, dot + 1);
                if (ParserUtility.SymbolIsTerminal(symbol) && typeof symbol != 'symbol') {
                    state.actions.set(symbol, itemStateId);
                }
                else {
                    state.goto.set(symbol, itemStateId);
                }
                if (!completed.has(itemStateId))
                    this.linkStates(itemStateId, completed);
            }
        }
        else {
            state.reduce = this.rules.id(state.rule);
        }
    }
    getStateId(rule, dot) {
        return this.rules.id(rule) + '.' + dot;
    }
}
//# sourceMappingURL=canonical-collection.js.map