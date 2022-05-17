"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFormatter = void 0;
function JSONFormatter(grammar, exportName) {
    const rules = [];
    for (const rule of grammar.rules) {
        rules.push(Object.assign(Object.assign({}, rule), { symbols: rule.symbols.map(symbol => {
                if (symbol instanceof RegExp) {
                    return {
                        regex: {
                            source: symbol.source,
                            flags: symbol.flags
                        }
                    };
                }
                return symbol;
            }) }));
    }
    return JSON.stringify({
        grammar: Object.assign(Object.assign({}, grammar), { rules, customTokens: Array.from(grammar.customTokens) }),
        exportName
    });
}
exports.JSONFormatter = JSONFormatter;
;
//# sourceMappingURL=json.js.map