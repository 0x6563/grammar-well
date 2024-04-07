import { Generator } from "../generator/generator";

export function JSONFormatter(generator: Generator, exportName) {
    return JSON.stringify({ state: generator.state, exportName });
}