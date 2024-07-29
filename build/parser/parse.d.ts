import { ParserAlgorithm, RuntimeParserClass } from "../typings/index.js";
declare const ParserRegistry: {
    [key: string]: ParserAlgorithm;
};
export declare function Parse(language: RuntimeParserClass, input: string, options?: ParserOptions, results?: 'full' | 'first'): any;
interface ParserOptions {
    algorithm: (keyof typeof ParserRegistry) | ParserAlgorithm;
    parserOptions?: any;
}
export {};
