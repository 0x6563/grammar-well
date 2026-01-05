export async function Timed(fn: () => any) {
    const start = performance.now();
    const output = await fn();
    const end = performance.now();
    const duration = end - start;
    return { output, duration }
}

