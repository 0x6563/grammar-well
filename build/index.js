"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatefulLexer = void 0;
__exportStar(require("./generator/generator"), exports);
__exportStar(require("./generator/import-resolver"), exports);
var stateful_lexer_1 = require("./lexers/stateful-lexer");
Object.defineProperty(exports, "StatefulLexer", { enumerable: true, get: function () { return stateful_lexer_1.StatefulLexer; } });
__exportStar(require("./parser/parser"), exports);
__exportStar(require("./typings"), exports);
__exportStar(require("./utility/monarch"), exports);
//# sourceMappingURL=index.js.map