import type { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeParserClass } from "../../../typings/index.ts";
import { ParserUtility } from "../../../utility/parsing.ts";
import { BiMap } from "./bimap.ts";
import { ClosureBuilder } from "./closure.ts";
import type { State } from "./state.ts";

export class CanonicalCollection {
    states: Map<string, State> = new Map();
    rules: BiMap<RuntimeGrammarProductionRule> = new BiMap();
    terminals: BiMap<RuntimeGrammarRuleSymbol> = new BiMap();
    public grammar: RuntimeParserClass['artifacts']['grammar'];

    private closure: ClosureBuilder;
    constructor(
        grammar: RuntimeParserClass['artifacts']['grammar']
    ) {
        this.grammar = grammar;
        const augmented = {
            name: Symbol() as unknown as string,
            symbols: [this.grammar.start]
        }
        this.grammar['rules'][augmented.name] = [augmented];
        this.closure = new ClosureBuilder(this.grammar);
        this.rules.id(augmented);
        this.addState(this.grammar['rules'][augmented.name][0], 0);
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