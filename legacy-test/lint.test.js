const expect = require("expect");

const { lint } = require("../build");

describe("Linter", function () {
    var mockGrammar, mockOpts, writeSpy;

    beforeEach(function () {
        mockGrammar = {
            rules: [],
            config: {}
        };
        mockOpts = {
            out: {
                write() { }
            }
        };
        writeSpy = stub(mockOpts.out, "write");
    })

    it("runs without warnings on empty rules", function () {
        lint(mockGrammar, mockOpts);
        expect(writeSpy.called).toEqual(false);
    });

    it("warns about undefined symbol", function () {
        mockGrammar.rules = [
            { name: "a", symbols: ["non-existent"] }
        ];
        lint(mockGrammar, mockOpts);
        expect(writeSpy.called).toEqual(true);
    });

    it("doesn't warn about defined symbol", function () {
        mockGrammar.rules = [
            { name: "a", symbols: [] },
            { name: "b", symbols: ["a"] }
        ];
        lint(mockGrammar, mockOpts);
        expect(writeSpy.called).toEqual(false);
    });

    it("doesn't warn about duplicate symbol", function () {
        mockGrammar.rules = [
            { name: "a", symbols: [] },
            { name: "a", symbols: [] },
            { name: "b", symbols: ["a"] }
        ];
        lint(mockGrammar, mockOpts);
        expect(writeSpy.called).toEqual(false);
    });
})

function stub(object, methodName) {
    const obj = { called: false };
    object[methodName] = (...args) => { obj.called = true };
    return obj;
}