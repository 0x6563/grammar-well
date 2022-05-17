"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIFO = exports.CircularFIFO = void 0;
class CircularFIFO {
    constructor(size) {
        this.size = size;
        this.$first = 0;
        this.$last = -1;
        this.buffer = Object.create(null);
        this.$length = 0;
    }
    get first() { return this.buffer[this.$first]; }
    get last() { return this.buffer[this.$last]; }
    add(element) {
        this.$last = this.translate(this.$last, 1);
        if (this.$length < this.size) {
            this.$length++;
        }
        else {
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
    peek(offset) {
        if (Math.abs(offset) > this.$length)
            return;
        if (offset >= 0) {
            offset = this.translate(this.$first, offset);
        }
        else {
            offset = this.translate(this.$last, offset + 1);
        }
        return this.buffer[offset];
    }
    translate(n, modifier) {
        const target = n + modifier;
        const end = this.size - 1;
        if (target > end)
            return 0;
        if (target < 0)
            return end + target;
        return target;
    }
}
exports.CircularFIFO = CircularFIFO;
class FIFO {
    constructor() {
        this.size = 0;
        this.index = 0;
        this.queue = Object.create(null);
    }
    get lastIndex() { return this.index + this.size - 1; }
    get first() { return this.queue[this.index]; }
    get last() { return this.queue[this.lastIndex]; }
    get length() { return this.size; }
    add(element) {
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
    peek(offset) {
        if (Math.abs(offset) > this.size) {
            return;
        }
        if (offset >= 0) {
            offset += this.index;
        }
        else {
            offset += 1 + this.lastIndex;
        }
        return this.queue[offset];
    }
}
exports.FIFO = FIFO;
//# sourceMappingURL=utility.js.map