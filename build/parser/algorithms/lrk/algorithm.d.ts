import { RuntimeParserClass } from "../../../typings/index.js";
import { TokenBuffer } from "../../../lexers/token-buffer.js";
export declare function LRK(language: RuntimeParserClass & {
    tokens: TokenBuffer;
}, options?: {}): {
    results: any[];
};
