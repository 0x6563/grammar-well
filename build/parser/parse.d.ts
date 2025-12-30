import type { ParserAlgorithm, RuntimeParserClass } from "../typings/index.ts";
declare const ParserRegistry: {
    [key: string]: ParserAlgorithm;
};
export declare function Parse(language: InstanceType<RuntimeParserClass>, input: string, options?: ParserOptions, results?: 'full' | 'first'): any;
interface ParserOptions {
    algorithm: (keyof typeof ParserRegistry) | ParserAlgorithm;
    parserOptions?: any;
}
export {};
