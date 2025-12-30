import V1Grammar from '../generator/grammars/v1.ts';
import V2Grammar from '../generator/grammars/v2.ts';
import { V2GrammarString } from "../generator/stringify/grammar/v2.ts";
import { Parse } from '../parser/parse.ts';

export function Format(source: string, sourceVersion: '1' | '2' = '2') {
    const grammar = sourceVersion.toString() == '1' ? V1Grammar : V2Grammar;
    const result = Parse(new grammar() as any, source);
    const stringer = new V2GrammarString();
    stringer.append(result);
    return stringer.source;
}