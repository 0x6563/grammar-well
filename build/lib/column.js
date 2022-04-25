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
exports.Column = void 0;
var parser_1 = require("./parser");
var state_1 = require("./state");
var Column = (function () {
    function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = Object.create(null);
        this.scannable = [];
        this.completed = Object.create(null);
    }
    Column.prototype.process = function (nextColumn) {
        var e_1, _a;
        var w = 0;
        var state;
        while (state = this.states[w++]) {
            if (state.isComplete) {
                state.finish();
                if (state.data !== parser_1.Parser.fail) {
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--;) {
                        this.complete(wantedBy[i], state);
                    }
                    if (state.reference === this.index) {
                        var name = state.rule.name;
                        this.completed[name] = this.completed[name] || [];
                        this.completed[name].push(state);
                    }
                }
            }
            else {
                var exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }
                if (this.wants[exp]) {
                    this.wants[exp].push(state);
                    if (this.completed[exp]) {
                        try {
                            for (var _b = (e_1 = void 0, __values(this.completed[exp])), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var right = _c.value;
                                this.complete(state, right);
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
                }
                else {
                    this.wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    };
    Column.prototype.predict = function (exp) {
        var e_2, _a;
        if (!this.grammar.byName[exp])
            return;
        try {
            for (var _b = __values(this.grammar.byName[exp]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var rule = _c.value;
                this.states.push(new state_1.State(rule, 0, this.index, this.wants[exp]));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Column.prototype.complete = function (left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
    };
    return Column;
}());
exports.Column = Column;
//# sourceMappingURL=column.js.map