
import { resolve } from "path";
import { Grammar } from "./grammar";
import { Parser } from "./parser";
import { FileSystemResolver, ImportResolver, ImportResolverConstructor } from "./import-resolver";
import { Tokenizer } from "./tokenizer";
import { ConfigDefinition, ExpressionDefinition, IncludeDefinition, JavascriptDefinition, MacroDefinition } from "../typings";

export function Compile(rules: RuleDefinitions, config: CompileOptions) {
    return Compiler(rules, config, {
        alreadycompiled: new Set(),
        resolver: config.resolver ? new config.resolver(config.basedir) : new FileSystemResolver(config.basedir),
        builtinResolver: new FileSystemResolver(resolve(__dirname, '../grammars/file.ne'))
    });
}

export function Compiler(rules: RuleDefinitions, config: CompileOptions, state: CompilerState) {
    const tokenizer = new Tokenizer(config);
    for (const rule of rules) {
        if ("body" in rule) {
            if (!config.noscript) {
                tokenizer.state.body.push(rule.body);
            }
        } else if ("include" in rule) {
            const resolver = rule.builtin ? state.builtinResolver : state.resolver;
            const path = resolver.path(rule.include);
            if (!state.alreadycompiled.has(path)) {
                state.alreadycompiled.add(path);
                const grammar = Grammar.fromCompiled(require('./nearley-language-bootstrapped.js'));
                const parser = new Parser(grammar);
                parser.feed(resolver.body(path));
                tokenizer.merge(Compiler(parser.results[0], config, state));
            }
        } else if ("macro" in rule) {
            tokenizer.state.macros[rule.macro] = { args: rule.args, exprs: rule.exprs };
        } else if ("config" in rule) {
            tokenizer.state.config[rule.config] = rule.value
        } else {
            tokenizer.feed(rule.name, rule.rules);
        }
    }

    return tokenizer.state;
}

export type RuleDefinitions = (JavascriptDefinition | IncludeDefinition | MacroDefinition | ConfigDefinition | ExpressionDefinition)[];

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