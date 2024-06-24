import { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLanguageDefinition } from "../../../typings/index.js";
import { ParserUtility } from "../../parser.js";
import { BiMap } from "./bimap.js";
import { ClosureBuilder } from "./closure.js";
import { State } from "./state.js";

export class CanonicalCollection {
    states: Map<string, State> = new Map();
    rules: BiMap<RuntimeGrammarProductionRule> = new BiMap();
    terminals: BiMap<RuntimeGrammarRuleSymbol> = new BiMap();

    private closure: ClosureBuilder;
    constructor(
        public grammar: RuntimeLanguageDefinition['grammar']
    ) {
        const augmented = {
            name: Symbol() as unknown as string,
            symbols: [grammar.start]
        }
        grammar['rules'][augmented.name] = [augmented];
        this.closure = new ClosureBuilder(grammar);
        this.rules.id(augmented);
        this.addState(grammar['rules'][augmented.name][0], 0);
        this.linkStates('0.0');
    }

    private addState(rule: RuntimeGrammarProductionRule, dot: number) {
        const id = this.getStateId(rule, dot);
        if (this.states.has(id))
            return;

        const state: State = {
            items: [],
            isFinal: false,
            actions: new Map(),
            goto: new Map(),
            reduce: null,
            rule: rule
        }

        state.items.push({ rule, dot });
        if (rule.symbols.length == dot)
            state.isFinal = true;

        this.states.set(id, state);

        state.items.push(...this.closure.get(rule.symbols[dot] as string))

        if (!state.isFinal)
            for (const { rule, dot } of state.items) {
                this.addState(rule, dot + 1);
            }
    }

    private linkStates(id: string, completed: Set<string> = new Set()) {
        completed.add(id);
        const state = this.states.get(id);
        if (!state.isFinal) {
            for (const { rule, dot } of state.items) {
                const symbol = rule.symbols[dot];
                const itemStateId = this.getStateId(rule, dot + 1);
                if (ParserUtility.SymbolIsTerminal(symbol) && typeof symbol != 'symbol') {
                    state.actions.set(symbol, itemStateId);
                } else {
                    state.goto.set(symbol, itemStateId);
                }

                if (!completed.has(itemStateId))
                    this.linkStates(itemStateId, completed);
            }
        } else {
            state.reduce = this.rules.id(state.rule);
        }
    }

    private getStateId(rule: RuntimeGrammarProductionRule, dot: number) {
        return this.rules.id(rule) + '.' + dot;
    }
}