import { PostProcessor } from "../typings";

export class Rule implements RuleConfig {
    static highestId: number = 0;
    id: number = ++Rule.highestId;
    constructor(
        public name: string,
        public symbols: (any)[],
        public postprocess: PostProcessor
    ) { }

    toString(withCursorAt?: number) {
        var symbolSequence = (typeof withCursorAt === "undefined")
            ? this.symbols.map(getSymbolShortDisplay).join(' ')
            : (this.symbols.slice(0, withCursorAt).map(getSymbolShortDisplay).join(' ')
                + " ● "
                + this.symbols.slice(withCursorAt).map(getSymbolShortDisplay).join(' '));
        return this.name + " → " + symbolSequence;
    }
}

function getSymbolShortDisplay(symbol) {
    var type = typeof symbol;
    if (type === "string") {
        return symbol;
    } else if (type === "object") {
        if (symbol.literal) {
            return JSON.stringify(symbol.literal);
        } else if (symbol instanceof RegExp) {
            return symbol.toString();
        } else if (symbol.type) {
            return '%' + symbol.type;
        } else if (symbol.test) {
            return '<' + String(symbol.test) + '>';
        } else {
            throw new Error('Unknown symbol type: ' + symbol);
        }
    }
}

interface LiteralToken {
    literal: any;
}
interface TokenType {
    type: string;
}
type Token = string | RegExp | LiteralToken | TokenType;

export interface RuleConfig {
    name: string;
    symbols: any;
    postprocess: PostProcessor
}
