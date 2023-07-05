"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LR = void 0;
const parser_1 = require("../parser");
function LR(language, _options = {}) {
    const { lr, tokens } = language;
    const { table } = lr;
    const stack = new LRStack();
    stack.push({ state: table['0.0'] });
    let token;
    while (token = tokens.next()) {
        for (const { symbol, next } of stack.current.state.actions) {
            if (parser_1.ParserUtility.TokenMatchesSymbol(token, symbol)) {
                stack.push({ symbol, state: table[next], value: token });
                break;
            }
        }
        while (stack.current.state?.isFinal) {
            const rule = stack.current.state.reduce;
            stack.reduce(rule);
            stack.current.value = parser_1.ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous?.state.goto[rule.name];
            stack.shift(table[s]);
        }
    }
    return { results: [stack.current.value] };
}
exports.LR = LR;
class LRStack {
    stack = [];
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
    push(item) {
        this.stack.push(new LRStackItem());
        Object.assign(this.current, item);
    }
}
class LRStackItem {
    children = [];
    state;
    symbol;
    rule;
    value;
}
//# sourceMappingURL=lr.js.map