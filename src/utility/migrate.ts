import { V2GrammarString } from "../generator/stringify/grammar/v2";
import v1 from '../generator/grammars/v1';
import { Parser } from "../parser/parser";

export function MigrateV1toV2(content: string) {
    const parser = new Parser(v1() as any);
    const stringer = new V2GrammarString();
    stringer.append(parser.run(content).results[0]);
    return stringer.source;

}