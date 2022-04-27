"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lint = void 0;
function warn(opts, str) {
    opts.out.write("WARN" + "\t" + str + "\n");
}
function lintNames(grm, opts) {
    const all = new Set();
    const { rules } = grm;
    rules.forEach(r => all.add(r.name));
    for (const rule of rules) {
        for (const symbol of rule.symbols) {
            if (!symbol.literal && !symbol.token && symbol.constructor !== RegExp) {
                if (!all.has(symbol)) {
                    warn(opts, "Undefined symbol `" + symbol + "` used.");
                }
            }
        }
    }
}
function lint(grm, opts) {
    if (!opts.out)
        opts.out = process.stderr;
    lintNames(grm, opts);
}
exports.lint = lint;
//# sourceMappingURL=lint.js.map