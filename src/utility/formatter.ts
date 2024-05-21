import { V2GrammarString } from "../generator/stringify/grammar/v2";
import v2 from '../generator/grammars/v2';
import { Parser } from "../parser/parser";

export function Formatter(content: string) {
    const parser = new Parser(v2() as any);
    const stringer = new V2GrammarString();
    stringer.append(parser.run(content).results[0]);
    return stringer.source;

}