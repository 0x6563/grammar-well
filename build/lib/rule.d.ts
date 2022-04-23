import { PostProcessor } from "../typings";
export declare class Rule {
    name: string;
    symbols: (any)[];
    postprocess: PostProcessor;
    static highestId: number;
    id: number;
    constructor(name: string, symbols: (any)[], postprocess: PostProcessor);
    toString(withCursorAt: any): string;
}
