"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFormatter = void 0;
function JSONFormatter(generator, exportName) {
    return JSON.stringify({ state: generator.state, exportName });
}
exports.JSONFormatter = JSONFormatter;
//# sourceMappingURL=json.js.map