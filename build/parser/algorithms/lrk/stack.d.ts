export declare class Stack<T> {
    private stack;
    get size(): number;
    get previous(): T;
    get current(): T;
    set current(item: T);
    push(...items: T[]): number;
    pop(n?: number): T[];
}
