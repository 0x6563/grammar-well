export class BiMap<T>{
    private map: Map<T, number> = new Map();
    private items: T[] = [];

    id(ref: T) {
        if (!this.map.has(ref)) {
            this.map.set(ref, this.items.length);
            this.items.push(ref);
        }

        return this.map.get(ref);
    }

    fetch(index: number) {
        return this.items[index];
    }
}