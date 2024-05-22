export function JSONFormatter(generator, exportName) {
    return JSON.stringify({ state: generator.state.export(), exportName });
}
//# sourceMappingURL=json.js.map