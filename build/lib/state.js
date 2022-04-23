"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
var parser_1 = require("./parser");
var State = (function () {
    function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.wantedBy = wantedBy;
        this.data = [];
        this.isComplete = this.dot === rule.symbols.length;
    }
    State.prototype.toString = function () {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    };
    State.prototype.nextState = function (child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
            state.right = undefined;
        }
        return state;
    };
    State.prototype.build = function () {
        var children = [];
        var node = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    };
    State.prototype.finish = function () {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, parser_1.Parser.fail);
        }
    };
    return State;
}());
exports.State = State;
//# sourceMappingURL=state.js.map