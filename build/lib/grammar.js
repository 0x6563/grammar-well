"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grammar = void 0;
var rule_1 = require("./rule");
var Grammar = (function () {
    function Grammar(rules, start) {
        var _this = this;
        this.rules = rules;
        this.start = start;
        this.byName = {};
        this.start = start || this.rules[0].name;
        this.rules.forEach(function (rule) {
            if (!_this.byName.hasOwnProperty(rule.name)) {
                _this.byName[rule.name] = [];
            }
            _this.byName[rule.name].push(rule);
        });
    }
    Grammar.fromCompiled = function (rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
            start = rules.ParserStart;
            rules = rules.ParserRules;
        }
        var rules = rules.map(function (r) { return (new rule_1.Rule(r.name, r.symbols, r.postprocess)); });
        var g = new Grammar(rules, start);
        g.lexer = lexer;
        return g;
    };
    return Grammar;
}());
exports.Grammar = Grammar;
//# sourceMappingURL=grammar.js.map