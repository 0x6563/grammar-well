import type { RuntimeParserClass } from "../../../typings/index.ts";
import { TokenBuffer } from "../../../lexers/token-buffer.ts";
export declare function LRK(language: RuntimeParserClass & {
    tokens: TokenBuffer;
}, options?: {}): {
    results: any[];
};
