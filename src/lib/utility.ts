export class CircularFIFO<T> {
    private $first: number = 0;
    private $last: number = -1;
    buffer: { [number: number]: T } = Object.create(null)
    $length: number = 0;

    get first() { return this.buffer[this.$first]; }
    get last() { return this.buffer[this.$last]; }

    constructor(private size: number) { }

    add(element: T) {
        this.$last = this.translate(this.$last, 1);
        if (this.$length < this.size) {
            this.$length++;
        } else {
            this.$first = this.translate(this.$first, 1);
        }
        this.buffer[this.$last] = element;
    }

    remove() {
        if (this.$length <= 0) {
            return;
        }

        const r = this.buffer[this.$first];
        delete this.buffer[this.$first];

        this.$first = this.translate(this.$first, 1);

        this.$length--;
        return r;
    }

    peek(offset: number) {
        if (Math.abs(offset) > this.$length)
            return;
        if (offset >= 0) {
            offset = this.translate(this.$first, offset);
        } else {
            offset = this.translate(this.$last, offset + 1);
        }
        return this.buffer[offset];
    }

    private translate(n: number, modifier: number) {
        const target = n + modifier;
        const end = this.size - 1;
        if (target > end)
            return 0;
        if (target < 0)
            return end + target;
        return target;
    }
}


export class FIFO<T> {
    private size: number = 0;
    private index: number = 0;
    private queue: { [number: number]: T } = Object.create(null);

    private get lastIndex() { return this.index + this.size - 1 }
    get first() { return this.queue[this.index]; }
    get last() { return this.queue[this.lastIndex]; }
    get length() { return this.size; }

    constructor() { }

    add(element: T) {
        this.size++;
        this.queue[this.lastIndex] = element;
    }

    remove() {
        if (this.size <= 0) {
            return;
        }

        const r = this.queue[this.index];
        delete this.queue[this.index];
        this.index++;
        this.size--;

        if (this.size == 0) {
            this.index = 0;
        }

        return r;
    }

    peek(offset: number) {
        if (Math.abs(offset) > this.size) {
            return;
        }
        if (offset >= 0) {
            offset += this.index;
        } else {
            offset += 1 + this.lastIndex;
        }
        return this.queue[offset];
    }
}


