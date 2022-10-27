import { TokenBuffer } from "../../lexers/token-buffer";
import { LanguageDefinition } from "../../typings";
export declare function LR(language: LanguageDefinition & {
    tokens: TokenBuffer;
}, options?: {}): {
    results: any[];
};
