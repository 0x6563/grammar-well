"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix = exports.CYK = void 0;
const parser_1 = require("../parser");
function CYK(language, options = {}) {
    const { grammar, tokens } = language;
    const terminals = [];
    const nonTerminals = [];
    for (const name in grammar.rules) {
        for (const rule of grammar.rules[name]) {
            const { symbols } = rule;
            if (parser_1.ParserUtility.SymbolIsTerminal(symbols[0])) {
                terminals.push(rule);
            }
            else {
                nonTerminals.push(rule);
            }
        }
    }
    let currentTokenIndex = -1;
    const chart = new Matrix(0, 0, () => new Map());
    for (const token of tokens) {
        currentTokenIndex++;
        chart.resize(currentTokenIndex + 2, currentTokenIndex + 2);
        for (const rule of terminals) {
            if (parser_1.ParserUtility.SymbolMatchesToken(rule.symbols[0], token)) {
                chart.get(currentTokenIndex, currentTokenIndex).set(rule.name, { rule, token });
            }
        }
        for (let floor = currentTokenIndex; floor >= 0; floor--) {
            for (let inner = floor; inner <= currentTokenIndex; inner++) {
                const leftCell = chart.get(floor, inner);
                const rightCell = chart.get(inner + 1, currentTokenIndex);
                for (const rule of nonTerminals) {
                    const { symbols: [leftSymbol, rightSymbol] } = rule;
                    const left = leftCell.get(leftSymbol);
                    const right = rightCell.get(rightSymbol);
                    if (left && right) {
                        chart.get(floor, currentTokenIndex).set(rule.name, { rule, left, right });
                    }
                }
            }
        }
    }
    const results = Array.from(chart.get(0, currentTokenIndex).values()).map(v => GetValue(v));
    return { results };
}
exports.CYK = CYK;
function GetValue(ref) {
    if (!ref)
        return;
    if ('token' in ref) {
        return parser_1.ParserUtility.PostProcess(ref.rule, [ref.token]);
    }
    return parser_1.ParserUtility.PostProcess(ref.rule, [GetValue(ref.left), GetValue(ref.right)]);
}
class Matrix {
    constructor(x, y, initial) {
        this.initial = initial;
        this.$x = 0;
        this.$y = 0;
        this.matrix = [];
        this.resize(x, y);
    }
    get x() { return this.$x; }
    set x(x) { x != this.$x && this.resize(x, this.y); }
    get y() { return this.$y; }
    set y(y) { y != this.$y && this.resize(this.x, y); }
    get(x, y) {
        return this.matrix[x][y];
    }
    set(x, y, value) {
        return this.matrix[x][y] = value;
    }
    resize(x, y) {
        if (x < this.x) {
            this.matrix.splice(x);
            this.$x = x;
        }
        if (y > this.y) {
            this.matrix.forEach(a => a.push(...Matrix.Array(y - a.length, this.initial)));
            this.$y = y;
        }
        else if (y < this.y) {
            this.matrix.forEach(a => a.splice(y + 1));
            this.$y = y;
        }
        if (x > this.x) {
            const ext = Matrix.Array(x - this.x, () => Matrix.Array(this.y, this.initial));
            this.matrix.push(...ext);
            this.$x = x;
        }
    }
    static Array(length, initial) {
        return Array.from({ length }, (typeof initial == 'function' ? initial : () => initial));
    }
}
exports.Matrix = Matrix;
//# sourceMappingURL=cyk.js.map