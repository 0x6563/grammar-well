import type { TokenBuffer } from "../../lexers/token-buffer";
import type { LanguageDefinition } from "../../typings";
export declare function LR(language: LanguageDefinition & {
    tokens: TokenBuffer;
}, _options?: {}): {
    results: any[];
};
