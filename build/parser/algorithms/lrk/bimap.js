export class BiMap {
    map = new Map();
    items = [];
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
//# sourceMappingURL=bimap.js.map