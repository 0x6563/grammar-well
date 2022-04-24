import { PostProcessor } from "../typings";
export declare class Rule implements RuleConfig {
    name: string;
    symbols: (any)[];
    postprocess: PostProcessor;
    static highestId: number;
    id: number;
    constructor(name: string, symbols: (any)[], postprocess: PostProcessor);
    toString(withCursorAt?: number): string;
}
export interface RuleConfig {
    name: string;
    symbols: any;
    postprocess: PostProcessor;
}
