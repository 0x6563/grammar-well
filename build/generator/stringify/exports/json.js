export function JSONFormatter(generator) {
    return JSON.stringify({ state: generator.state.export(), export: generator.options });
}
//# sourceMappingURL=json.js.map