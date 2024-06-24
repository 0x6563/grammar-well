import { RuntimeLanguageDefinition } from "../../../typings/index.js";
import { TokenBuffer } from "../../../lexers/token-buffer.js";
export declare function LRK(language: RuntimeLanguageDefinition & {
    tokens: TokenBuffer;
}, options?: {}): {
    results: any[];
};
