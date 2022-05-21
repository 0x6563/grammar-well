import { GeneratorState } from "../generator";

export function JSONFormatter(grammar: GeneratorState, exportName) {
    const rules = [];
    for (const rule of grammar.rules) {
        rules.push({
            ...rule,
            symbols: rule.symbols.map(symbol => {
                if (symbol instanceof RegExp) {
                    return {
                        regex: {
                            source: symbol.source,
                            flags: symbol.flags
                        }
                    }
                }
                return symbol;
            })
        })
    }
    return JSON.stringify({
        grammar: {
            ...grammar,
            rules,
            customTokens: Array.from(grammar.customTokens)
        },
        exportName
    });
};