import { TokenBuffer } from "../../../lexers/token-buffer";
import { LanguageDefinition } from "../../../typings";
import { ParserUtility } from "../../parser";
import { CanonicalCollection } from "./canonical-collection";
import { LRStack } from "./stack";

export function LR0(language: LanguageDefinition & { tokens: TokenBuffer }, options = {}) {
    const { grammar, tokens } = language;
    const collection = new CanonicalCollection(grammar);
    const stack = new LRStack();
    const s = collection.states.get('0.0');
    stack.append(s.rule.name);
    stack.shift(s);
    let token;

    while (token = tokens.next()) {
        for (const [symbol, state] of stack.current.state.actions) {
            if (ParserUtility.SymbolMatchesToken(symbol, token)) {
                stack.append(symbol);
                stack.shift(collection.states.get(state));
                stack.current.value = token;
                break;
            }
        }
        while (stack.current.state?.isFinal) {
            const rule = collection.rules.getItem(stack.current.state.reduce);
            stack.reduce(rule);
            stack.current.value = ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous.state.goto.get(rule.name);
            stack.shift(collection.states.get(s));

        }
    }

    return { results: [stack.current.value] }
}

