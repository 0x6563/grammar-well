import v2 from '../generator/grammars/v2';
import { V2GrammarString } from "../generator/stringify/grammar/v2";
import { Parser } from "../parser/parser";
export function Formatter(content) {
    const parser = new Parser(v2());
    const stringer = new V2GrammarString();
    stringer.append(parser.run(content).results[0]);
    return stringer.source;
}
//# sourceMappingURL=formatter.js.map