import V1Grammar from "../generator/grammars/v1.js";
import V2Grammar from "../generator/grammars/v2.js";
import { V2GrammarString } from "../generator/stringify/grammar/v2.js";
import { Parse } from "../parser/parse.js";
export function Format(source, sourceVersion = '2') {
    const grammar = sourceVersion.toString() == '1' ? V1Grammar : V2Grammar;
    const result = Parse(new grammar(), source);
    const stringer = new V2GrammarString();
    stringer.append(result);
    return stringer.source;
}
//# sourceMappingURL=format.js.map