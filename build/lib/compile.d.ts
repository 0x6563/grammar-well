import { ImportResolver, ImportResolverConstructor } from "./import-resolver";
interface ProductionRule {
    body: any;
    builtin: any;
    include: any;
    macro: any;
    args: any;
    exprs: any;
    config: any;
    value: any;
    rules: any;
    name: any;
}
interface CompileOptions {
    alreadycompiled: Set<string>;
    version: string;
    nojs: boolean;
    args: any[];
    resolver?: ImportResolverConstructor;
    resolverInstance?: ImportResolver;
}
export declare function Compile(structure: ProductionRule[], opts: CompileOptions): any;
export {};
