import { GeneratorState } from "../../typings";
import { SerializeState } from "../generator";


export function TypescriptFormat(state: GeneratorState, exportName: string) {
    return `// Generated automatically by Grammar-Well, version ${state.version} 
// https://github.com/0x6563/grammar-well

${state.head.join('\n')}

interface LanguageDefinition {
    lexer?: Lexer | LexerConfig;
    grammar: {
        start: string;
        rules: GrammarRule[];
    }
}

interface Lexer {
    next(): LexerToken | undefined;
    feed(chunk?: string, state?: ReturnType<Lexer['state']>): void;
    state(): any;
    flush?(): void;
}

interface LexerConfig {
    start?: string
    states: LexerStateDefinition[];
}

interface LexerToken {
    type?: string;
    value: string;
    offset: number;
    line: number;
    column: number;
}

interface LexerStatus {
    index: number;
    line: number;
    column: number;
    state: string;
}

interface LexerStateDefinition {
    name: string;
    unmatched?: string;
    default?: string;
    rules: (LexerStateImportRule | LexerStateMatchRule)[];
}

interface LexerStateImportRule {
    import: string[]
}

interface LexerStateMatchRule {
    when: string | RegExp
    type?: string;
    pop?: number | 'all';
    inset?: number;
    goto?: string;
    set?: string;
}

interface GrammarRule {
    name: string;
    symbols: RuleSymbol[];
    postprocess?: PostProcessor;
}

type RuleSymbol = string | RegExp | RuleSymbolToken | RuleSymbolLexerToken | LexerTokenMatch | RuleSymbolTestable;

interface RuleSymbolToken {
    literal: any;
}

interface RuleSymbolTestable {
    test: (data: any) => boolean;
}

interface RuleSymbolLexerToken {
    type: string;
}

interface LexerTokenMatch {
    token: string;
}

type PostProcessor = (payload: PostProcessorPayload) => any;

interface PostProcessorPayload {
    data: any[];
    reference: number;
    dot: number;
    name: string;
    reject: Symbol;
}

function ${exportName}(): LanguageDefinition {
    ${state.body.join('\n')}
    return ${SerializeState(state, 1)}
}

export default ${exportName};

`;
};