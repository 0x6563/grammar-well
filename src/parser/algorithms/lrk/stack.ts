export class Stack<T> {

    private stack: T[] = [];

    get size() {
        return this.stack.length;
    }

    get previous() {
        return this.stack[this.stack.length - 2];
    }

    get current() {
        return this.stack[this.stack.length - 1];
    }

    set current(item: T) {
        this.stack[this.stack.length - 1] = item;
    }

    push(...items: T[]) {
        return this.stack.push(...items);
    }

    pop(n: number = 1): T[] {
        return this.stack.splice(n * -1, n);
    }
}