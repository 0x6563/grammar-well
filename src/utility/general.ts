import { Dictionary, GrammarRuleSymbol } from "../typings";


export class Collection<T> {
    categorized: Dictionary<Dictionary<number>> = {};
    uncategorized = new Map<T, number>();
    items: T[] = [];

    constructor(ref: T[] = []) {
        for (const s of ref) {
            this.encode(s);
        }
    }

    encode(ref: T): number {
        const c = this.resolve(ref);
        if (c)
            return this.addCategorized(c.category, c.key, ref);
        return this.addUncategorized(ref);
    }

    decode(id: number | string): T {
        return this.items[typeof id == 'string' ? parseInt(id) : id];
    }

    has(ref: T) {
        const c = this.resolve(ref);
        if (c)
            return (c.key in this.categorized[c.category])
        return this.uncategorized.has(ref);
    }

    redirect(source: T, target: T) {
        this.items[this.encode(source)] = target;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    resolve(_: T): { category: keyof Collection<T>['categorized'], key: string } | void { }

    private addCategorized(category: keyof Collection<T>['categorized'], key: string, ref: T): number {
        if (!(key in this.categorized[category])) {
            this.categorized[category][key] = this.items.length;
            this.items.push(ref);
        }
        return this.categorized[category][key];
    }

    private addUncategorized(ref: T): number {
        if (!this.uncategorized.has(ref)) {
            this.uncategorized.set(ref, this.items.length);
            this.items.push(ref);
        }
        return this.uncategorized.get(ref);
    }

}

export class SymbolCollection extends Collection<GrammarRuleSymbol>{
    categorized = {
        nonTerminal: {},
        literalI: {},
        literalS: {},
        token: {},
        regex: {},
        function: {},
    }

    resolve(symbol: GrammarRuleSymbol) {
        if (typeof symbol == 'string') {
            return { category: 'nonTerminal', key: symbol };
        } else if ('literal' in symbol) {
            if (symbol.insensitive)
                return { category: 'literalI', key: symbol.literal }
            return { category: 'literalS', key: symbol.literal }
        } else if ('token' in symbol) {
            return { category: 'token', key: symbol.token }
        } else if (symbol instanceof RegExp) {
            return { category: 'regex', key: symbol.toString() }
        } else if (typeof symbol == 'function') {
            return { category: 'function', key: symbol.toString() }
        }
    }
}

export class Matrix<T> {
    private $x = 0;
    private $y = 0;
    get x() { return this.$x }
    set x(x: number) { x != this.$x && this.resize(x, this.y); }
    get y() { return this.$y }
    set y(y: number) { y != this.$y && this.resize(this.x, y); }

    matrix: GetCallbackOrValue<T>[][] = [];

    constructor(x: number, y: number, private initial?: T | ((...args: any) => T)) {
        this.resize(x, y);
    }

    get(x: number, y: number): T {
        return this.matrix[x][y];
    }

    set(x: number, y: number, value: any) {
        return this.matrix[x][y] = value;
    }

    resize(x: number, y: number) {
        if (x < this.x) {
            this.matrix.splice(x);
            this.$x = x;
        }
        if (y > this.y) {
            this.matrix.forEach(a => a.push(...Matrix.Array(y - a.length, this.initial)));
            this.$y = y;
        } else if (y < this.y) {
            this.matrix.forEach(a => a.splice(y + 1));
            this.$y = y;
        }
        if (x > this.x) {
            const ext = Matrix.Array(x - this.x, () => Matrix.Array(this.y, this.initial))
            this.matrix.push(...ext);
            this.$x = x;
        }
    }

    static Array<T>(length, initial?: T | ((...args: any) => T)): GetCallbackOrValue<T>[] {
        return Array.from({ length }, (typeof initial == 'function' ? initial : () => initial) as any);
    }
}


export function Flatten(obj: any[] | { [key: string]: any }): FlatObject {
    const collection = new Collection();
    const $null = Symbol();
    function Traverse(src: any) {
        if (src == null) {
            src = $null;
        }
        if (collection.has(src)) {
            return collection.encode(src)
        }
        collection.encode(src);
        if (Array.isArray(src)) {
            collection.redirect(src, src.map(v => Traverse(v)));
        } else if (typeof src === 'object') {
            const o = {};
            for (const k in src) {
                o[k] = Traverse(src[k])
            }
            collection.redirect(src, o);
        } else if (typeof src === 'function') {
            return collection.redirect(src, src.toString());
        }
        return collection.encode(src);
    }
    Traverse(obj);
    collection.redirect($null, null);
    return collection.items as any;
}

export function Unflatten(items: FlatObject) {
    const visited = new Set();
    function Traverse(id: number) {
        if (visited.has(id)) {
            return items[id];
        }
        visited.add(id);
        const obj: any = items[id];
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                const ii = obj[i];
                obj[i] = Traverse(ii);

            }
        } else if (typeof obj === 'object') {
            for (const k in obj as { [key: string]: any }) {
                obj[k] = Traverse(obj[k])
            }
        }
        return obj;
    }
    return Traverse(0);
}

type FlatObject = (boolean | number | string | (number[]) | { [key: string]: number })[];

type GetCallbackOrValue<T> = T extends (...args: any) => any ? ReturnType<T> : T;
