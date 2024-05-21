"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formatter = void 0;
const v2_1 = require("../generator/stringify/grammar/v2");
const v2_2 = require("../generator/grammars/v2");
const parser_1 = require("../parser/parser");
function Formatter(content) {
    const parser = new parser_1.Parser((0, v2_2.default)());
    const stringer = new v2_1.V2GrammarString();
    stringer.append(parser.run(content).results[0]);
    return stringer.source;
}
exports.Formatter = Formatter;
//# sourceMappingURL=formatter.js.map