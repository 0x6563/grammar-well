export class Stack {
    stack = [];
    get size() {
        return this.stack.length;
    }
    get previous() {
        return this.stack[this.stack.length - 2];
    }
    get current() {
        return this.stack[this.stack.length - 1];
    }
    set current(item) {
        this.stack[this.stack.length - 1] = item;
    }
    push(...items) {
        return this.stack.push(...items);
    }
    pop(n = 1) {
        return this.stack.splice(n * -1, n);
    }
}
//# sourceMappingURL=stack.js.map