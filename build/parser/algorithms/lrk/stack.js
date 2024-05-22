export class LRStack {
    stack = [];
    get current() {
        return this.stack[this.stack.length - 1];
    }
    get previous() {
        return this.stack[this.stack.length - 2];
    }
    shift(state) {
        this.current.state = state;
    }
    reduce(rule) {
        const n = LRStack.NewItem();
        const l = rule.symbols.length;
        n.children = this.stack.splice(l * -1, l);
        n.children.forEach(v => delete v.state);
        n.rule = rule;
        n.symbol = rule.name;
        this.stack.push(n);
    }
    append(symbol) {
        this.stack.push(LRStack.NewItem());
        this.current.symbol = symbol;
    }
    static NewItem() {
        return {
            children: [],
            state: null,
            symbol: null,
            rule: null,
            value: null
        };
    }
}
//# sourceMappingURL=stack.js.map