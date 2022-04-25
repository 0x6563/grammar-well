import { BuiltInPostProcessor, PostProcessor } from "../typings";
export declare class Rule implements RuleConfig {
    name: string;
    symbols: (any)[];
    postprocess: PostProcessor | BuiltInPostProcessor | string;
    static highestId: number;
    id: number;
    constructor(name: string, symbols: (any)[], postprocess: PostProcessor | BuiltInPostProcessor | string);
    toString(withCursorAt?: number): string;
}
export interface RuleConfig {
    name: string;
    symbols: any;
    postprocess: PostProcessor | BuiltInPostProcessor | string;
}
