import { TokenBuffer } from "../../lexers/token-buffer";
import { LanguageDefinition } from "../../typings";
import { CanonicalCollection, LRStack } from "../../utility/lr";
import { ParserUtility } from "../parser";

export function LR(language: LanguageDefinition & { tokens: TokenBuffer, canonical?: CanonicalCollection }, options = {}) {
    const { grammar, tokens, canonical } = language;
    const collection = canonical || new CanonicalCollection(grammar);
    const stack = new LRStack();
    const s = collection.states['0.0'];
    stack.add(null);
    stack.shift(s);
    let token;

    while (token = tokens.next()) {
        for (const [symbol, state] of stack.current.state.actions) {
            if (ParserUtility.TokenMatchesSymbol(token, symbol)) {
                stack.add(symbol);
                stack.shift(collection.states[state]);
                stack.current.value = token;
                break;
            }
        }

        while (stack.current.state?.isFinal) {
            const rule = stack.current.state.reduce;
            stack.reduce(rule);
            stack.current.value = ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous.state.goto.get(rule.name);
            stack.shift(collection.states[s]);

        }
    }

    return { results: [stack.current.value], canonical: collection }
}