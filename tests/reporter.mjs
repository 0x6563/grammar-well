import { Transform } from "stream";
const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const Dim = "\x1b[2m";
const Underscore = "\x1b[4m";
const Blink = "\x1b[5m";
const Reverse = "\x1b[7m";
const Hidden = "\x1b[8m";

const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";
const FgGray = "\x1b[90m";

const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";
const BgGray = "\x1b[100m";

class TestReporter {
    suiteHeader = true;
    last = {};
    logs = [];
    queue = [];
    running = [];
    events = {
        'test:enqueue': (event) => {
            return '';
        },
        'test:dequeue': (event) => {
            this.running.push(event.data.name);
            // return this.print(`${event.data.name} dequeued`, false, false)
        },
        'test:watch:drained': (event) => {
            return 'test watch queue drained';
        },
        'test:start': (event) => {
            // return this.print(`${event.data.name} started`, true, false);
        },
        'test:pass': (event) => {
            this.running.pop();
            if (event.data.details?.type) {
                this.suiteHeader = true;
                // return this.print(`${FgGreen}passed${Reset} ${this.running.join(' > ')} ${event.data.name}`);
            } else {
                let l = '';
                if (this.suiteHeader) {
                    l += this.print(`${FgYellow}Suite${Reset} ${this.running.join(' > ')}`);
                    this.suiteHeader = false;
                }
                l += this.print(`${FgGreen}✓${Reset} ${event.data.name}`, true);
                return l;
            }
        },
        'test:fail': (event) => {
            this.running.pop();
            if (event.data.details?.type) {
                this.suiteHeader = true;
                // return this.print(`${FgRed}failed${Reset} ${this.running.join(' > ')} ${event.data.name}`, false);
            } else {
                let l = '';
                if (this.suiteHeader) {
                    l += this.print(`${FgYellow}Suite${Reset} ${this.running.join(' > ')}`);
                    this.suiteHeader = false;
                }
                l += this.print(`${FgRed}𐄂${Reset} ${BgRed}${FgWhite}${event.data.name}${Reset}`, true);
                l += this.print(`${FgWhite}${event.data.details.error.cause}${Reset}\n`, 4);
                return l;
            }
        },
        'test:plan': (event) => {
            // return this.print(`Tests(${event.data.count}): ${event.data.file}:${event.data.line}:${event.data.column}`, false);
        },
        'test:diagnostic': (event) => {
            // return this.print(`Diagnostic: ${event.data.message}`, false);
        },
        'test:stderr': (event) => {
            return this.print(`${FgRed}${event.data.message}${Reset}`);
        },
        'test:stdout': (event) => {
            return this.print(event.data.message);

            // return this.print(event.data.message);
        },
        'test:coverage': (event) => {
            const { totalLineCount } = event.data.summary.totals;
            return `total line count: ${totalLineCount}\n`;
        },
        'done': () => {
            console.log('\n' + this.logs.join('\n'))
        }
    }
    print(content, indent = false, temporary = false) {
        const space = ' ';
        const empty = '';
        const leading = indent ? space.repeat(indent + 1) : empty;
        const prefix = this.last.temporary ? `\r${space.repeat(this.last.length)}\r` : empty;
        const line = leading + content.replace(/\n/gm, '\n' + leading) + (temporary ? empty : '\n');
        this.last = {
            temporary,
            length: line.length,
            line: prefix + line
        }
        return this.last.line;
    }

    transform() {
        return new Transform({
            writableObjectMode: true,
            transform: (event, encoding, callback) => {
                const result = this.events[event.type]?.(event) || '';
                if (result && typeof result == 'object') {
                    callback(result, '');
                } else {
                    callback(null, result || '');
                }
            },
            flush: () => {
                this.events['done']?.();
            }
        });
    }
}

export default new TestReporter().transform()