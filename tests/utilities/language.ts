import { Generate, Parse, type GeneratorOutputOptions, type RuntimeParserClass } from '../../build/index.js';
import { DictionaryResolver } from '../../build/generator/import-resolvers/dictionary.js';
import { Grammars } from './samples.ts';
const resolver = new DictionaryResolver(Grammars);

export function ParseInput(parser: RuntimeParserClass, input: string, options: { algorithm: 'earley', parserOptions?: {} } = { algorithm: 'earley' }, results: 'first' | 'full' = 'first') {
    return Parse(parser, input, options, results);
}

export function Compile(source: string, options?: GeneratorOutputOptions): Promise<string> {
    return Generate(source, {
        output: {
            ...options,
            name: 'grammar',
            format: 'commonjs'
        },
        resolver
    }) as Promise<string>;
}