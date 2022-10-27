import { expect } from "chai";
import { TokenBuffer } from "../../../src/lexers/token-buffer";
// import { LexerState } from "../../../src/typings";
const moo = require("moo");
describe('Lexer Adapter', () => {
    const ABC = 'ABC';
    const DEF = 'DEF';
    const BaseState = {
        column: 0,
        line: 0,
        lineOffset: 0,
        index: 0,
        indexOffset: 0
    };

    // it('Retrieve first token', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     const token = lexer.next();
    //     expect(token.value).equal('A');
    //     expectState(lexer.state, BaseState);
    // })

    // it('Retrieve next token', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next();
    //     const token = lexer.next();
    //     expect(token.value).equal('B');
    //     expectState(lexer.state, {
    //         ...BaseState,
    //         column: 1,
    //         index: 1,
    //     });
    // })

    // it('Retrieve previous token', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     const { value } = lexer.previous();
    //     expect(value).equal('A');
    // })

    // it('Previous Out of Range undefined', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     const previous = lexer.previous();
    //     expect(previous).be.undefined;
    // })

    // it('Next Out of Range undefined', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     lexer.next(); // C

    //     const next = lexer.next();
    //     expect(next).be.undefined;
    // })


    // it('Peek State 0', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     const { value } = lexer.peek(0);
    //     expect(value).equal('B');
    // })

    // it('Peek State -1', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     const { value } = lexer.peek(-1);
    //     expect(value).equal('A');
    // })

    // it('Peek State +1', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     const { value } = lexer.peek(+1);
    //     expect(value).equal('C');
    //     expectState(lexer.state, {
    //         ...BaseState,
    //         column: 1,
    //         index: 1
    //     })
    // })

    // it('Peek Out Of Range -1 undefined', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     const peek = lexer.peek(-2);
    //     expect(peek).be.undefined;
    // })

    // it('Peek Out Of Range +1 undefined', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     const peek = lexer.peek(+2);
    //     expect(peek).be.undefined;
    // })

    // it('Restore State', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     const state = lexer.state;
    //     lexer.next(); // C

    //     const next = lexer.next();
    //     expect(next).be.undefined;
    //     lexer.restore(state);
    //     const { value } = lexer.previous();
    //     expect(value).equal('A');
    //     expectState(lexer.state, {
    //         ...BaseState,
    //     })
    // })

    // it('Feed State', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     lexer.next(); // C

    //     const next = lexer.next();
    //     expect(next).be.undefined;
    //     lexer.feed(DEF);
    //     const { value } = lexer.next();
    //     expect(value).equal('D');
    //     expectState(lexer.state, {
    //         ...BaseState,
    //         column: 3,
    //         index: 3,
    //     })
    // })

    // it('Flush State', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     lexer.next(); // C

    //     const next = lexer.next();
    //     expect(next).be.undefined;
    //     lexer.feed(DEF, true);
    //     const { value } = lexer.next();
    //     expect(value).equal('D');
    //     expect((lexer as any).history[0].token.value).equal('C');
    //     expectState(lexer.state, {
    //         ...BaseState,
    //         column: 3,
    //         index: 1,
    //         indexOffset: 2,
    //     })
    // })

    // it('Reset State', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     lexer.next(); // A
    //     lexer.next(); // B
    //     lexer.next(); // C

    //     const next = lexer.next();
    //     expect(next).be.undefined;
    //     lexer.feed(DEF, true);
    //     expect(lexer.next().value).equal('D');
    //     expect((lexer as any).history[0].token.value).equal('C');

    //     lexer.reset(ABC);
    //     const { value } = lexer.next();
    //     expect(value).equal('A');
    //     expect((lexer as any).history[0].token.value).equal('A');
    //     expectState(lexer.state, BaseState)
    // })



    // it('Restore State & Feed State', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed(ABC);
    //     expect(lexer.next().value).equal('A');
    //     const state = lexer.state;
    //     let next;
    //     while (next = lexer.next()) { }
    //     expect(next).be.undefined;
    //     lexer.restore(state);
    //     lexer.feed(DEF);
    //     expect(lexer.next().value).equal('B');

    //     while (next = lexer.next()) { }
    //     expect(next).be.undefined;
    //     expect(lexer.previous().value).equal('E');

    //     expectState(lexer.state, {
    //         ...BaseState,
    //         column: 4,
    //         index: 4,
    //     })
    // })

    // it('New Line', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed('A\nB\nC\n');
    //     lexer.next(); // A
    //     lexer.next(); // \n

    //     const { value } = lexer.next();
    //     expect(value).equal('B');
    //     expectState(lexer.state, {
    //         ...BaseState,
    //         index: 2,
    //         line: 1,
    //     })
    // })

    // it('New Line Flush', () => {
    //     const lexer = WrappedLexer();
    //     lexer.feed('A\nB\nC\n');
    //     lexer.next(); // A
    //     lexer.next(); // \n

    //     const { value } = lexer.next();
    //     expect(value).equal('B');
    //     expectState(lexer.state, {
    //         ...BaseState,
    //         index: 2,
    //         line: 1,
    //     })
    //     lexer.flush();

    //     expectState(lexer.state, {
    //         ...BaseState,
    //         indexOffset: 2,
    //         line: 1
    //     })

    // })
})

// function expectState(actual: LexerState, expected: LexerState) {
//     expect(actual.column, 'state.column does not match').equal(expected.column);
//     expect(actual.line, 'state.line does not match').equal(expected.line);
//     expect(actual.lineOffset, 'state.lineOffset does not match').equal(expected.lineOffset);
//     expect(actual.index, 'state.index does not match').equal(expected.index);
//     expect(actual.indexOffset, 'state.indexOffset does not match').equal(expected.indexOffset);
// }

// function WrappedLexer() {
//     return new TokenQueue(moo.compile({
//         A: /A/,
//         B: /B/,
//         C: /C/,
//         D: /D/,
//         E: /E/,
//         F: /F/,
//         n: { match: /\s+/, lineBreaks: true }
//     }));
// }