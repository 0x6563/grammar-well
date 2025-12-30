import { JavaScriptGenerator } from "../javascript.ts";

export function JSONFormatter(generator: JavaScriptGenerator) {
    return JSON.stringify({ state: generator.state.export(), output: generator.options });
}