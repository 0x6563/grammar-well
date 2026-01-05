export function NOOP(language, _options = {}) {
    const { tokens } = language;
    const result = [];
    for (const token of tokens) {
        result.push(token);
    }
    return { results: [result] };
}
//# sourceMappingURL=noop.js.map