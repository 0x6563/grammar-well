"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
var parser_1 = require("./parser");
var state_1 = require("./state");
var Column = (function () {
    function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {};
        this.scannable = [];
        this.completed = {};
    }
    Column.prototype.process = function (nextColumn) {
        var exp;
        for (var w = 0; w < this.states.length; w++) {
            var state = this.states[w];
            if (state.isComplete) {
                state.finish();
                if (state.data !== parser_1.Parser.fail) {
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--;) {
                        var left = wantedBy[i];
                        this.complete(left, state);
                    }
                    if (state.reference === this.index) {
                        exp = state.rule.name;
                        (this.completed[exp] = this.completed[exp] || []).push(state);
                    }
                }
            }
            else {
                exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }
                if (this.wants[exp]) {
                    this.wants[exp].push(state);
                    if (this.completed.hasOwnProperty(exp)) {
                        var nulls = this.completed[exp];
                        for (var i_1 = 0; i_1 < nulls.length; i_1++) {
                            var right = nulls[i_1];
                            this.complete(state, right);
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
        var rules = this.grammar.byName[exp] || [];
        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var wantedBy = this.wants[exp];
            var s = new state_1.State(r, 0, this.index, wantedBy);
            this.states.push(s);
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