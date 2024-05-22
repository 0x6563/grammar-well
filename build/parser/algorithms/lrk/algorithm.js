import { ParserUtility } from "../../parser";
import { CanonicalCollection } from "./canonical-collection";
import { LRStack } from "./stack";
export function LRK(language, options = {}) {
    const { grammar, tokens } = language;
    const { states, rules: rules } = new CanonicalCollection(grammar);
    const stack = new LRStack();
    const s = states.get('0.0');
    stack.append(s.rule.name);
    stack.shift(s);
    let token;
    while (token = tokens.next()) {
        for (const [symbol, state] of stack.current.state.actions) {
            if (ParserUtility.SymbolMatchesToken(symbol, token)) {
                stack.append(symbol);
                stack.shift(states.get(state));
                stack.current.value = token;
                break;
            }
        }
        while (stack.current.state?.isFinal) {
            const rule = rules.fetch(stack.current.state.reduce);
            stack.reduce(rule);
            stack.current.value = ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous.state.goto.get(rule.name);
            stack.shift(states.get(s));
        }
    }
    return { results: [stack.current.value] };
}
//# sourceMappingURL=algorithm.js.map