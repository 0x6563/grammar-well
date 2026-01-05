import { resolve } from 'node:path';
import { Worker } from 'node:worker_threads';
import { Timed } from './timings.ts';

export async function Benchmark<T>(task: () => T, iterations: number = 1000): Promise<{
    hot: AnalysisOutput,
    cold: AnalysisOutput,
    output: Awaited<T>,
    memory: string
}> {
    const coldSamples = new Float64Array(5);
    const hotSamples = new Float64Array(iterations);
    let lastOutput;
    if (global.gc)
        global.gc();

    const memoryMonitor = new Worker(resolve(import.meta.dirname, './memory.ts'));
    memoryMonitor.postMessage('start');



    for (let i = 0; i < coldSamples.length; i++) {
        if (global.gc)
            global.gc();
        const { duration, output } = await Timed(task);
        coldSamples[i] = duration;
        lastOutput = output;
    }

    for (let i = 0; i < hotSamples.length; i++) {
        if (global.gc)
            global.gc();
        const { duration, output } = await Timed(task);
        hotSamples[i] = duration;
        lastOutput = output;
    }


    memoryMonitor.postMessage('stop');
    const { peak }: any = await new Promise(resolve => {
        memoryMonitor.once('message', resolve);
    });
    await memoryMonitor.terminate();
    if (global.gc)
        global.gc();
    return {
        cold: Analysis(Array.from(coldSamples), 0),
        hot: Analysis(Array.from(hotSamples), 0.05),
        output: lastOutput,
        memory: (peak / 1024 / 1024).toFixed(2) + " MB"
    };
}


export function Analysis(samples: number[], trimRatio: number = 0.05): AnalysisOutput {
    const sorted = [...samples].sort((a, b) => a - b);
    const count = sorted.length;
    const trimCount = Math.floor(count * trimRatio);
    const middleSamples = sorted.slice(trimCount, count - trimCount);
    const average = middleSamples.reduce((a, b) => a + b) / middleSamples.length;
    const median = sorted[Math.floor(count / 2)];
    const variance = samples.reduce((s, x) => s + Math.pow(x - average, 2), 0) / count;
    const stdDev = Math.sqrt(variance);

    return {
        low: sorted[0],
        high: sorted[sorted.length - 1],
        average,
        median,
        stdDev,
        cv: ((stdDev / average) * 100).toFixed(1) + "%"
    };
}

export interface AnalysisOutput {
    low: number;
    high: number;
    average: number;
    median: number;
    stdDev: number;
    cv: string;
}