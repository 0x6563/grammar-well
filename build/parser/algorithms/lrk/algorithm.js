import { ParserUtility } from "../../../utility/parsing.js";
import { CanonicalCollection } from "./canonical-collection.js";
import { Stack } from "./stack.js";
export function LRK(language, options = {}) {
    const { grammar } = language.artifacts;
    const { tokens } = language;
    const { start } = new CanonicalCollection(grammar);
    const stateStack = new Stack();
    const inputStack = new Stack();
    stateStack.push(start);
    let token;
    tokenloop: while (token = tokens.next()) {
        const match = stateStack.current.actions.find(a => ParserUtility.SymbolMatchesToken(a.symbol, token));
        if (match) {
            inputStack.push(token);
            stateStack.push(match.state);
        }
        else {
            throw new Error("Syntax Error: Unexpected Token");
        }
        while (stateStack.current.reduce) {
            const rule = stateStack.current.reduce;
            const value = inputStack.pop(rule.symbols.length);
            stateStack.pop(rule.symbols.length);
            inputStack.push(ParserUtility.PostProcess(rule, value));
            const nextState = stateStack.current.goto[rule.name];
            if (!nextState)
                break tokenloop;
            stateStack.push(nextState);
        }
    }
    if (stateStack.size > 1) {
        throw new Error("Syntax Error: Unexpected End of Input");
    }
    const peek = tokens.next();
    if (peek) {
        console.log(peek);
        throw new Error("Syntax Error: Expected End of Input");
    }
    return { results: [inputStack.current[0]] };
}
//# sourceMappingURL=algorithm.js.map