import type { RuntimeParserClass } from "../../typings/index.ts";
import { TokenBuffer } from "../../lexers/token-buffer.ts";

export function NOOP(language: RuntimeParserClass & { tokens: TokenBuffer }, _options = {}) {
    const { tokens } = language;
    const result = [];
    for (const token of tokens) {
        result.push(token);
    }
    return { results: [result] };
}
