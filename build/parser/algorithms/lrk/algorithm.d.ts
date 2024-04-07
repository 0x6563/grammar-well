import { TokenBuffer } from "../../../lexers/token-buffer";
import { LanguageDefinition } from "../../../typings";
export declare function LRK(language: LanguageDefinition & {
    tokens: TokenBuffer;
}, options?: {}): {
    results: any[];
};
