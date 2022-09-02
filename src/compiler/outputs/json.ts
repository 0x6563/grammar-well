import { GeneratorState } from "../../typings";

export function JSONFormatter(state: GeneratorState, exportName) {
    return JSON.stringify({ state, exportName });
};