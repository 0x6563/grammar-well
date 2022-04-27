"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
class Rule {
    constructor(name, symbols, postprocess) {
        this.name = name;
        this.symbols = symbols;
        this.postprocess = postprocess;
        this.id = ++Rule.highestId;
    }
    toString(withCursorAt) {
        var symbolSequence = (typeof withCursorAt === "undefined")
            ? this.symbols.map(getSymbolShortDisplay).join(' ')
            : (this.symbols.slice(0, withCursorAt).map(getSymbolShortDisplay).join(' ')
                + " ● "
                + this.symbols.slice(withCursorAt).map(getSymbolShortDisplay).join(' '));
        return this.name + " → " + symbolSequence;
    }
}
exports.Rule = Rule;
Rule.highestId = 0;
function getSymbolShortDisplay(symbol) {
    var type = typeof symbol;
    if (type === "string") {
        return symbol;
    }
    else if (type === "object") {
        if (symbol.literal) {
            return JSON.stringify(symbol.literal);
        }
        else if (symbol instanceof RegExp) {
            return symbol.toString();
        }
        else if (symbol.type) {
            return '%' + symbol.type;
        }
        else if (symbol.test) {
            return '<' + String(symbol.test) + '>';
        }
        else {
            throw new Error('Unknown symbol type: ' + symbol);
        }
    }
}
//# sourceMappingURL=rule.js.map