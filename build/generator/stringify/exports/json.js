export function JSONFormatter(generator) {
    return JSON.stringify({ state: generator.state.export(), output: generator.options });
}
//# sourceMappingURL=json.js.map