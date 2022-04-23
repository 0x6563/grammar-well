import { CoffeescriptOutput } from "../formats/coffeescript";
import { ESMOutput, JavascriptOutput } from "../formats/javascript";
import { TypescriptFormat } from "../formats/typescript";

const Registry = {
    _default: JavascriptOutput,
    js: JavascriptOutput,
    javascript: JavascriptOutput,
    module: ESMOutput,
    esmodule: ESMOutput,
    cs: CoffeescriptOutput,
    coffee: CoffeescriptOutput,
    coffeescript: CoffeescriptOutput,
    ts: TypescriptFormat,
    typescript: TypescriptFormat
}

export function Generate(parser, exportName) {
    if (!parser.config.preprocessor) {
        parser.config.preprocessor = "_default";
    }

    if (!Registry[parser.config.preprocessor]) {
        throw new Error("No such preprocessor: " + parser.config.preprocessor)
    }

    return Registry[parser.config.preprocessor](parser, exportName);
};

