"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LR = void 0;
const lr_1 = require("../../utility/lr");
const parser_1 = require("../parser");
function LR(language, options = {}) {
    const { grammar, tokens, canonical } = language;
    const collection = canonical || new lr_1.CanonicalCollection(grammar);
    const stack = new lr_1.LRStack();
    const s = collection.states['0.0'];
    stack.add(null);
    stack.shift(s);
    let token;
    while (token = tokens.next()) {
        for (const [symbol, state] of stack.current.state.actions) {
            if (parser_1.ParserUtility.TokenMatchesSymbol(token, symbol)) {
                stack.add(symbol);
                stack.shift(collection.states[state]);
                stack.current.value = token;
                break;
            }
        }
        while (stack.current.state?.isFinal) {
            const rule = stack.current.state.reduce;
            stack.reduce(rule);
            stack.current.value = parser_1.ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous.state.goto.get(rule.name);
            stack.shift(collection.states[s]);
        }
    }
    return { results: [stack.current.value], canonical: collection };
}
exports.LR = LR;
//# sourceMappingURL=lr.js.map