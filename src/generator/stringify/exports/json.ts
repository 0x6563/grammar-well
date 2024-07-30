import { JavaScriptGenerator } from "../javascript.js";

export function JSONFormatter(generator: JavaScriptGenerator) {
    return JSON.stringify({ state: generator.state.export(), output: generator.options });
}