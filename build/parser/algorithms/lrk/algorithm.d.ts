import { TokenBuffer } from "../../../lexers/token-buffer";
import { RuntimeLanguageDefinition } from "../../../typings";
export declare function LRK(language: RuntimeLanguageDefinition & {
    tokens: TokenBuffer;
}, options?: {}): {
    results: any[];
};
