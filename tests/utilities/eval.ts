import vm from "node:vm";

export function Eval<T>(source: string): T {
    const sandbox = { module: { exports: {} } };
    // Creates a safe execution context
    vm.createContext(sandbox);
    // Runs the code in that context
    vm.runInContext(source, sandbox);

    return sandbox.module.exports as T;
}
