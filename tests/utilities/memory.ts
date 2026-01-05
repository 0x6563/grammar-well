import { parentPort } from 'worker_threads';
import inspector from 'node:inspector';

let start = 0;
let peak = 0;
let last = 0;
let interval: any = null;

const session = new inspector.Session();
session.connectToMainThread();

parentPort?.on('message', (cmd) => {
    if (cmd === 'start') {
        start = 0;
        last = 0;
        peak = 0;
        interval = setInterval(() => {
            session.post('Runtime.getHeapUsage', (err, params: any) => {
                if (!err && params) {
                    last = params.usedSize;
                    if (!start)
                        start = last;
                    if (last > peak)
                        peak = last;
                }
            });
        }, 1);
    } else if (cmd === 'stop') {
        clearInterval(interval);
        parentPort?.postMessage({ start, peak, stop: last });
    }
});