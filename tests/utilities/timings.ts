export async function Benchmark<T>(task: () => T, iterations: number = 1000): Promise<{
    output: Awaited<T>,
    cold: number,
    hot: number,
    deviation: number
}> {
    const cold = await Timed(task);

    // Warmup
    for (let i = 0; i < 100; i++) task();

    let mean = 0;
    let m2 = 0;

    for (let i = 0; i < iterations; i++) {
        const { duration } = await Timed(task);

        const delta = duration - mean;
        mean += delta / (i + 1);
        m2 += delta * (duration - mean);
    }

    const deviation = Math.sqrt(m2 / iterations);

    return {
        output: cold.output,
        cold: cold.duration,
        hot: mean,
        deviation
    };
}

export async function Timed(fn: () => any) {
    const start = performance.now();
    const output = await fn();
    const end = performance.now();
    const duration = end - start;
    return { output, duration }
}
