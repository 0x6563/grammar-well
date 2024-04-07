"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiMap = void 0;
class BiMap {
    constructor() {
        this.map = new Map();
        this.items = [];
    }
    id(ref) {
        if (!this.map.has(ref)) {
            this.map.set(ref, this.items.length);
            this.items.push(ref);
        }
        return this.map.get(ref);
    }
    fetch(index) {
        return this.items[index];
    }
}
exports.BiMap = BiMap;
//# sourceMappingURL=bimap.js.map