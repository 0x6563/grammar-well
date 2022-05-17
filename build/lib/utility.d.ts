export declare class CircularFIFO<T> {
    private size;
    private $first;
    private $last;
    buffer: {
        [number: number]: T;
    };
    $length: number;
    get first(): T;
    get last(): T;
    constructor(size: number);
    add(element: T): void;
    remove(): T;
    peek(offset: number): T;
    private translate;
}
export declare class FIFO<T> {
    private size;
    private index;
    private queue;
    private get lastIndex();
    get first(): T;
    get last(): T;
    get length(): number;
    constructor();
    add(element: T): void;
    remove(): T;
    peek(offset: number): T;
}
