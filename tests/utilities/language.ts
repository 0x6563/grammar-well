import { Generate as CandidateGenerate, Parse as CandidateParse } from '../../src/index.ts';
import { Generate as StableGenerate, Parse as StableParse } from 'grammar-well';
import type { GeneratorOutputOptions, RuntimeParserClass } from '../../src/index.ts';
import { DictionaryResolver } from '../../src/generator/import-resolvers/dictionary.ts';
import { Grammars } from './samples.ts';
const resolver = new DictionaryResolver(Grammars);

export const Candidate = {
    Parse(
        parser: RuntimeParserClass,
        input: string,
        options: { algorithm: 'earley', parserOptions?: {} } = { algorithm: 'earley' },
        results: 'first' | 'full' = 'first') {
        return CandidateParse(parser, input, options, results);
    },
    Compile(source: string, options?: GeneratorOutputOptions): Promise<string> {
        return CandidateGenerate(source, {
            output: {
                ...options,
                name: 'grammar',
                format: 'commonjs'
            },
            resolver
        }) as Promise<string>;
    }
}

export const Stable = {
    Parse(
        parser: RuntimeParserClass,
        input: string,
        options: { algorithm: 'earley', parserOptions?: {} } = { algorithm: 'earley' },
        results: 'first' | 'full' = 'first') {
        return StableParse(parser, input, options, results);
    },
    Compile(source: string, options?: GeneratorOutputOptions): Promise<string> {
        return StableGenerate(source, {
            output: {
                ...options,
                name: 'grammar',
                format: 'commonjs'
            },
            resolver
        }) as Promise<string>;
    }
}