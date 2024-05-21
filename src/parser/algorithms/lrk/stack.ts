import { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol } from "../../../typings";
import { State } from "./state";

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

    reduce(rule: RuntimeGrammarProductionRule) {
        const n = LRStack.NewItem();
        const l = rule.symbols.length;
        n.children = this.stack.splice(l * -1, l);
        n.children.forEach(v => delete v.state);
        n.rule = rule;
        n.symbol = rule.name;
        this.stack.push(n);
    }

    append(symbol: RuntimeGrammarRuleSymbol) {
        this.stack.push(LRStack.NewItem())
        this.current.symbol = symbol;
    }

    static NewItem(): LRStackItem {
        return {
            children: [],
            state: null,
            symbol: null,
            rule: null,
            value: null
        }
    }
}

interface LRStackItem {
    children: LRStackItem[];
    state: State;
    symbol: RuntimeGrammarRuleSymbol;
    rule: RuntimeGrammarProductionRule;
    value: any;
}