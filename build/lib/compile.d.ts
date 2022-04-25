import { ImportResolver, ImportResolverConstructor } from "./import-resolver";
import { ConfigDefinition, ExpressionDefinition, IncludeDefinition, JavascriptDefinition, MacroDefinition } from "../typings";
export declare function Compile(rules: RuleDefinitions, config: CompileOptions): import("./tokenizer").TokenizerState;
export declare function Compiler(rules: RuleDefinitions, config: CompileOptions, state: CompilerState): import("./tokenizer").TokenizerState;
export declare type RuleDefinitions = (JavascriptDefinition | IncludeDefinition | MacroDefinition | ConfigDefinition | ExpressionDefinition)[];
export interface CompileOptions {
    version: string;
    noscript: boolean;
    basedir?: string;
    resolver?: ImportResolverConstructor;
    resolverInstance?: ImportResolver;
}
interface CompilerState {
    alreadycompiled: Set<string>;
    resolver: ImportResolver;
    builtinResolver: ImportResolver;
}
export {};
