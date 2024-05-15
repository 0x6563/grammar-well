import { JavaScriptGenerator } from "../javascript";

export function JSONFormatter(generator: JavaScriptGenerator, exportName) {
    return JSON.stringify({ state: generator.state.export(), exportName });
}