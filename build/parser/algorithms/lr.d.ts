import { TokenBuffer } from "../../lexers/token-buffer";
import { LanguageDefinition } from "../../typings";
import { CanonicalCollection } from "../../utility/lr";
export declare function LR(language: LanguageDefinition & {
    tokens: TokenBuffer;
    canonical?: CanonicalCollection;
}, options?: {}): {
    results: any[];
    canonical: CanonicalCollection;
};
