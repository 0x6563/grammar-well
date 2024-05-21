"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrateV1toV2 = void 0;
const v2_1 = require("../generator/stringify/grammar/v2");
const v1_1 = require("../generator/grammars/v1");
const parser_1 = require("../parser/parser");
function MigrateV1toV2(content) {
    const parser = new parser_1.Parser((0, v1_1.default)());
    const stringer = new v2_1.V2GrammarString();
    stringer.append(parser.run(content).results[0]);
    return stringer.source;
}
exports.MigrateV1toV2 = MigrateV1toV2;
//# sourceMappingURL=migrate.js.map