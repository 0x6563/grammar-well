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
exports.lint = void 0;
function warn(opts, str) {
    opts.out.write("WARN" + "\t" + str + "\n");
}
function lintNames(grm, opts) {
    var e_1, _a, e_2, _b;
    var all = new Set();
    var rules = grm.rules;
    rules.forEach(function (r) { return all.add(r.name); });
    try {
        for (var rules_1 = __values(rules), rules_1_1 = rules_1.next(); !rules_1_1.done; rules_1_1 = rules_1.next()) {
            var rule = rules_1_1.value;
            try {
                for (var _c = (e_2 = void 0, __values(rule.symbols)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var symbol = _d.value;
                    if (!symbol.literal && !symbol.token && symbol.constructor !== RegExp) {
                        if (!all.has(symbol)) {
                            warn(opts, "Undefined symbol `" + symbol + "` used.");
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rules_1_1 && !rules_1_1.done && (_a = rules_1.return)) _a.call(rules_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function lint(grm, opts) {
    if (!opts.out)
        opts.out = process.stderr;
    lintNames(grm, opts);
}
exports.lint = lint;
//# sourceMappingURL=lint.js.map