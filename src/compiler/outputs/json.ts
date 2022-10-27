import { Generator } from "../generator";

export function JSONFormatter(generator: Generator, exportName) {
    return JSON.stringify({ state: generator.state, exportName });
};