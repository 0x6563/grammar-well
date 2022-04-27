"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
var grammar_1 = require("./grammar");
var parser_1 = require("./parser");
var Interpreter = (function () {
    function Interpreter(grammar, options) {
        this.options = options;
        this.grammar = grammar_1.Grammar.fromCompiled(grammar);
        this.parser = new parser_1.Parser(this.grammar, options);
    }
    Object.defineProperty(Interpreter.prototype, "results", {
        get: function () {
            return this.parser.results;
        },
        enumerable: false,
        configurable: true
    });
    Interpreter.prototype.feed = function (source) {
        this.parser.feed(source);
    };
    Interpreter.prototype.run = function (source) {
        var parser = new parser_1.Parser(this.grammar, this.options);
        parser.feed(source);
        return parser.results[0];
    };
    return Interpreter;
}());
exports.Interpreter = Interpreter;
//# sourceMappingURL=interpreter.js.map