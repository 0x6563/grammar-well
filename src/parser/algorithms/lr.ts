import type { TokenBuffer } from "../../lexers/token-buffer";
import type { LanguageDefinition } from "../../typings";
import type { GrammarRule, GrammarRuleSymbol, LRState } from "../../typings";
import { ParserUtility } from "../parser";

export function LR(language: LanguageDefinition & { tokens: TokenBuffer }, _options = {}) {
    const { lr, tokens } = language;
    const { table } = lr;
    const stack = new LRStack();
    stack.push({ state: table['0.0'] });

    let token;

    // eslint-disable-next-line no-cond-assign
    while (token = tokens.next()) {
        for (const { symbol, next } of stack.current.state.actions) {
            if (ParserUtility.TokenMatchesSymbol(token, symbol)) {
                stack.push({ symbol, state: table[next], value: token });
                break;
            }
        }

        while (stack.current.state?.isFinal) {
            const rule = stack.current.state.reduce;
            stack.reduce(rule);
            stack.current.value = ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous?.state.goto[rule.name];
            stack.shift(table[s]);
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

    shift(state: LRState) {
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

    push(item: Partial<LRStackItem>) {
        this.stack.push(new LRStackItem());
        Object.assign(this.current, item);
    }
}

class LRStackItem {
    children: LRStackItem[] = [];
    state: LRState;
    symbol: GrammarRuleSymbol;
    rule: GrammarRule;
    value: any;
} 