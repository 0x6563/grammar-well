import { Column } from "./column";
import { Grammar } from "./grammar";
import { Rule } from "./rule";
import { Lexer, LexerState, StreamLexer } from "./lexer";
import { State } from "./state";

export interface ParserOptions {
    keepHistory?: boolean;
    lexer: Lexer;
}

export class Parser {
    static fail = Symbol();
    keepHistory: boolean = false;
    current: number = 0;

    grammar: Grammar;
    lexer: Lexer;
    lexerState: LexerState;
    table: Column[];
    results: any;

    constructor(grammar: Grammar, options?: ParserOptions)
    constructor(rules: Rule[], start?: string, options?: ParserOptions)
    constructor(a: Rule[] | Grammar, b?: string | ParserOptions, c?: ParserOptions) {
        let options: ParserOptions;
        if (a instanceof Grammar) {
            this.grammar = a;
            options = b as ParserOptions;
        } else {
            this.grammar = new Grammar(a, b as string);
            options = c;
        }
        this.keepHistory = !!(options?.keepHistory);

        this.lexer = options?.lexer || this.grammar.lexer || new StreamLexer();

        const column = new Column(this.grammar, 0);
        this.table = [column];

        column.wants[this.grammar.start] = [];
        column.predict(this.grammar.start);
        column.process();
    }

    next() {
        try {
            return this.lexer.next();
        } catch (e) {
            const nextColumn = new Column(this.grammar, this.current + 1);
            this.table.push(nextColumn);
            const err: any = new Error(this.reportLexerError(e));
            err.offset = this.current;
            err.token = e.token;
            throw err;
        }
    }

    feed(chunk: string) {
        this.lexer.reset(chunk, this.lexerState);
        let token, column;

        while (token = this.next()) {
            column = this.table[this.current];

            if (!this.keepHistory) {
                delete this.table[this.current - 1];
            }

            const n = this.current + 1;
            const nextColumn = new Column(this.grammar, n);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            const literal = token.text !== undefined ? token.text : token.value;
            const value = this.lexer.constructor === StreamLexer ? token.value : token;
            const { scannable } = column;
            for (let w = scannable.length; w--;) {
                const state = scannable[w];
                const expect: any = state.rule.symbols[state.dot];
                // Try to consume the token
                // either regex or literal
                if ((expect as RegExp).test ? (expect as RegExp).test(value) :
                    expect.type ? expect.type === token.type
                        : expect.literal === literal) {
                    // Add it
                    const next = state.nextState({ data: value, token: token, isToken: true, reference: n - 1 });
                    nextColumn.states.push(next);
                }
            }

            // Next, for each of the rules, we either
            // (a) complete it, and try to see if the reference row expected that
            //     rule
            // (b) predict the next nonterminal it expects by adding that
            //     nonterminal's start state
            // To prevent duplication, we also keep track of rules we have already
            // added

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                const err: any = new Error(this.reportError(token));
                err.offset = this.current;
                err.token = token;
                throw err;
            }

            if (this.keepHistory) {
                column.lexerState = this.lexer.save()
            }

            this.current++;
        }

        if (column) {
            this.lexerState = this.lexer.save()
        }

        // Incrementally keep track of results
        this.results = this.finish();
    };

    reportLexerError(lexerError) {
        let tokenDisplay, lexerMessage;
        // Planning to add a token property to moo's thrown error
        // even on erroring tokens to be used in error display below
        const token = lexerError.token;
        if (token) {
            tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
            lexerMessage = this.lexer.formatError(token, "Syntax error");
        } else {
            tokenDisplay = "input (lexer error)";
            lexerMessage = lexerError.message;
        }
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    };

    reportError(token) {
        const tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== undefined ? token.value : token);
        const lexerMessage = this.lexer.formatError(token, "Syntax error");
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    };

    reportErrorCommon(lexerMessage, tokenDisplay) {
        const lines = [];
        lines.push(lexerMessage);
        const lastColumnIndex = this.table.length - 2;
        const lastColumn = this.table[lastColumnIndex];
        const expectantStates = lastColumn.states
            .filter(function (state) {
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
            stateStacks.forEach(function (stateStack) {
                const state = stateStack[0];
                const nextSymbol = state.rule.symbols[state.dot];
                const symbolDisplay = this.getSymbolDisplay(nextSymbol);
                lines.push('A ' + symbolDisplay + ' based on:');
                this.displayStateStack(stateStack, lines);
            }, this);
        }
        lines.push("");
        return lines.join("\n");
    }

    displayStateStack(stateStack, lines) {
        let lastDisplay;
        let sameDisplayCount = 0;
        for (let j = 0; j < stateStack.length; j++) {
            const state = stateStack[j];
            const display = state.rule.toString(state.dot);
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
    };

    getSymbolDisplay(symbol) {
        const type = typeof symbol;
        if (type === "string") {
            return symbol;
        } else if (type === "object") {
            if (symbol.literal) {
                return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
                return 'character matching ' + symbol;
            } else if (symbol.type) {
                return symbol.type + ' token';
            } else if (symbol.test) {
                return 'token matching ' + String(symbol.test);
            } else {
                throw new Error('Unknown symbol type: ' + symbol);
            }
        }
    };

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
    };

    save() {
        const column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    };

    restore(column: Column) {
        const index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;

        // Incrementally keep track of results
        this.results = this.finish();
    };

    // nb. deprecated: use save/restore instead!
    rewind(index: number) {
        if (!this.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding')
        }
        // nb. recall column (table) indicies fall between token indicies.
        //        col 0   --   token 0   --   col 1
        this.restore(this.table[index]);
    };

    finish() {
        const considerations = [];
        const { start } = this.grammar;
        const { states } = this.table[this.table.length - 1];
        for (const { rule: { name, symbols }, dot, reference, data } of states) {
            if (name === start && dot === symbols.length && !reference && data !== Parser.fail) {
                considerations.push(data);
            }
        }
        return considerations;
    };
}
