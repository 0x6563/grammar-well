const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

export class PseudoRandomJSONGenerator {
    initialSeed: number;

    private currentNodes: number = 0;
    private maxNodes: number;
    private currentSeed: number;
    private maxDepth: number;

    constructor(seed: number, nodes: number) {
        this.initialSeed = seed;
        this.currentSeed = seed;
        this.maxNodes = nodes;
        this.maxDepth = Math.ceil(this.maxNodes * .25);
    }

    generate() {
        this.currentNodes = 0;
        this.currentSeed = this.initialSeed;
        return JSON.stringify(this.node(0, 1));
    }

    next() {
        this.currentSeed = (this.currentSeed + 0x6D2B79F5) | 0;
        let t = this.currentSeed;

        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    integer(min: number, max: number) {
        return Math.floor(this.next() * (max - min + 1)) + min
    }

    string(len: number) {
        let str = "";
        for (let i = 0; i < len; i++) {
            str += alphabet[this.integer(0, 35)];
        }
        return str;
    }

    boolean() {
        return this.next() > .5;
    }

    object(depth: number): any {
        const children = this.children(depth);
        const container: { [key: string]: string } = {};

        for (let i = 0; i < children.length; i++) {
            container[this.string(this.integer(0, 100))] = this.node(depth + 1, children[i]);
        }
        return container;
    }

    array(depth: number) {
        const children = this.children(depth);

        for (let i = 0; i < children.length; i++) {
            children[i] = this.node(depth + 1, children[i]);
        }

        return children;
    }

    node(depth: number, nodeType?: number) {
        nodeType = nodeType || this.randomNodeType();

        if (nodeType == 1)
            return this.object(depth);

        if (nodeType == 2)
            return this.array(depth);

        if (nodeType == 3)
            return this.string(this.integer(0, 100));

        if (nodeType == 4)
            return this.integer(0, 0xFFFF);

        if (nodeType == 5)
            return this.boolean();

        return null;
    }

    randomNodeType() {
        return this.integer(0, 5);
    }

    children(depth: number) {
        const nestable = this.maxDepth - depth;
        let i = 0;
        const children = [];
        while (i < nestable && this.currentNodes <= this.maxNodes) {
            this.currentNodes++;
            const t = this.randomNodeType();
            if (t == 1 || t == 2) {
                i++;
            }
            children.push(t)
        }
        return children;
    }
}