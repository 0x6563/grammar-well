import { GrammarRule, GrammarRuleSymbol } from "../../../typings";
import { State } from "./state";

export class Node {
    children: Node[] = [];
    state: State;
    symbol: GrammarRuleSymbol;
    rule: GrammarRule;
    value: any;
}

export class LRStack {

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