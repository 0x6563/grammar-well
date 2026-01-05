import type { RuntimeParserClass } from "../../typings/index.ts";
import { TokenBuffer } from "../../lexers/token-buffer.ts";
export declare function NOOP(language: RuntimeParserClass & {
    tokens: TokenBuffer;
}, _options?: {}): {
    results: any[][];
};
