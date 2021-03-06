import { Rule } from "../../../typings";
import { Message } from "../../../utility/message";
import { NearleyParser } from "./parser";
import { State } from "./state";

export class ParserErrorService {
    constructor(private parser: NearleyParser) { }

    lexerError(lexerError) {
        let tokenDisplay, lexerMessage;
        // Planning to add a token property to moo's thrown error
        // even on erroring tokens to be used in error display below
        const token = lexerError.token;
        if (token) {
            tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
            lexerMessage = Message.LexerTokenError(this.parser.lexer);
        } else {
            tokenDisplay = "input (lexer error)";
            lexerMessage = lexerError.message;
        }
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    }

    tokenError(token) {
        const tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== undefined ? token.value : token);
        const lexerMessage = Message.LexerTokenError(this.parser.lexer);
        const error: any = new Error(this.reportErrorCommon(lexerMessage, tokenDisplay));
        error.offset = this.parser.current;
        error.token = token;
        return error;
    }

    private displayStateStack(stateStack, lines) {
        let lastDisplay;
        let sameDisplayCount = 0;
        for (let j = 0; j < stateStack.length; j++) {
            const state = stateStack[j];
            const display = this.formatRule(state.rule, state.dot);
            if (display === lastDisplay) {
                sameDisplayCount++;
            } else {
                if (sameDisplayCount > 0) {
                    lines.push('    ^ ' + sameDisplayCount + ' more lines identical to this');
                }
                sameDisplayCount = 0;
                lines.push('    ' + display);
            }
            lastDisplay = display;
        }
    }

    private reportErrorCommon(lexerMessage, tokenDisplay) {
        const lines = [];
        lines.push(lexerMessage);
        const lastColumnIndex = this.parser.table.length - 2;
        const lastColumn = this.parser.table[lastColumnIndex];
        const expectantStates = lastColumn.states
            .filter((state) => {
                const nextSymbol = state.rule.symbols[state.dot];
                return nextSymbol && typeof nextSymbol !== "string";
            });

        if (expectantStates.length === 0) {
            lines.push('Unexpected ' + tokenDisplay + '. I did not expect any more input. Here is the state of my parse table:\n');
            this.displayStateStack(lastColumn.states, lines);
        } else {
            lines.push('Unexpected ' + tokenDisplay + '. Instead, I was expecting to see one of the following:\n');
            // Display a "state stack" for each expectant state
            // - which shows you how this state came to be, step by step.
            // If there is more than one derivation, we only display the first one.
            const stateStacks = expectantStates.map(state => this.buildFirstStateStack(state, new Set()) || [state]);
            // Display each state that is expecting a terminal symbol next.
            stateStacks.forEach((stateStack) => {
                const state = stateStack[0];
                const nextSymbol = state.rule.symbols[state.dot];
                const symbolDisplay = Message.GetSymbolDisplay(nextSymbol, false, true);
                lines.push('A ' + symbolDisplay + ' based on:');
                this.displayStateStack(stateStack, lines);
            });
        }
        lines.push("");
        return lines.join("\n");
    }

    /*
    Builds a the first state stack. You can think of a state stack as the call stack
    of the recursive-descent parser which the Nearley parse algorithm simulates.
    A state stack is represented as an array of state objects. Within a
    state stack, the first item of the array will be the starting
    state, with each successive item in the array going further back into history.
    
    This function needs to be given a starting state and an empty array representing
    the visited states, and it returns an single state stack.
    
    */
    buildFirstStateStack(state: State, visited: Set<State>) {
        if (visited.has(state)) {
            return null;
        }
        if (state.wantedBy.length === 0) {
            return [state];
        }
        const prevState = state.wantedBy[0];
        const childVisited = new Set(visited);
        childVisited.add(state);
        const childResult = this.buildFirstStateStack(prevState, childVisited);
        if (childResult === null) {
            return null;
        }
        return [state].concat(childResult);
    }

    formatRule(rule: Rule, withCursorAt?: number) {
        let symbolSequence = rule.symbols.slice(0, withCursorAt).map(v => Message.GetSymbolDisplay(v, true, true)).join(' ');
        if (typeof withCursorAt !== "undefined") {
            symbolSequence += " ??? " + rule.symbols.slice(withCursorAt).map(v => Message.GetSymbolDisplay(v, true, true)).join(' ');
        };
        return rule.name + " ??? " + symbolSequence;
    }
}
