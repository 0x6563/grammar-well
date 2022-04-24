"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grammar = void 0;
var rule_1 = require("./rule");
var Grammar = (function () {
    function Grammar(rules, start) {
        var e_1, _a;
        this.rules = rules;
        this.start = start;
        this.byName = Object.create(null);
        this.start = this.start || this.rules[0].name;
        try {
            for (var _b = __values(this.rules), _c = _b.next(); !_c.done; _c = _b.next()) {
                var rule = _c.value;
                if (!this.byName[rule.name])
                    this.byName[rule.name] = [rule];
                else
                    this.byName[rule.name].push(rule);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    Grammar.fromCompiled = function (_a) {
        var ParserRules = _a.ParserRules, ParserStart = _a.ParserStart, Lexer = _a.Lexer;
        var rules = ParserRules.map(function (r) { return new rule_1.Rule(r.name, r.symbols, r.postprocess); });
        var grammar = new Grammar(rules, ParserStart);
        grammar.lexer = Lexer;
        return grammar;
    };
    return Grammar;
}());
exports.Grammar = Grammar;
//# sourceMappingURL=grammar.js.map