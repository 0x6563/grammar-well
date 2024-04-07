"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRK = void 0;
const parser_1 = require("../../parser");
const canonical_collection_1 = require("./canonical-collection");
const stack_1 = require("./stack");
function LRK(language, options = {}) {
    var _a;
    const { grammar, tokens } = language;
    const { states, rules: rules } = new canonical_collection_1.CanonicalCollection(grammar);
    const stack = new stack_1.LRStack();
    const s = states.get('0.0');
    stack.append(s.rule.name);
    stack.shift(s);
    let token;
    while (token = tokens.next()) {
        for (const [symbol, state] of stack.current.state.actions) {
            if (parser_1.ParserUtility.SymbolMatchesToken(symbol, token)) {
                stack.append(symbol);
                stack.shift(states.get(state));
                stack.current.value = token;
                break;
            }
        }
        while ((_a = stack.current.state) === null || _a === void 0 ? void 0 : _a.isFinal) {
            const rule = rules.fetch(stack.current.state.reduce);
            stack.reduce(rule);
            stack.current.value = parser_1.ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous.state.goto.get(rule.name);
            stack.shift(states.get(s));
        }
    }
    return { results: [stack.current.value] };
}
exports.LRK = LRK;
//# sourceMappingURL=algorithm.js.map