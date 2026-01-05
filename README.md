# Grammar Well

Grammar Well is a cross-platform compiler, parser, and/or interpreter. It originated as a port of the popular library [Nearley](https://github.com/kach/nearley) to TypeScript but has since evolved to include additional functionality, such as a built-in lexer and support for various parsing algorithms including LR0 and CKY. It also offers a range of quality of life features.

Check out the documentation at https://grammar-well.xyz/

# Quick Start
### Install
`npm i grammar-well`

### Example

```Javascript
import { Compile, Parse } from 'grammar-well';

const source = `
import * from whitespace;

lexer {
	start: "json"

	[json]
		- import whitespace
		- when r:{-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b} tag "number"
		- when r:{"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"} tag "string"
		- when "{" tag "{"
		- when "}" tag "}"
		- when "[" tag "["
		- when "]" tag "]"
		- when "," tag ","
		- when ":" tag ":"
		- when "true" tag "true"
		- when "false" tag "false"
		- when "null" tag "null"

}

grammar {
	start: "json"

	[json]
		| _ (object | array) _ => ( $1[0] )

	[object]
		| "{" _ "}" => ( {} )
		| "{" _ pair (_ "," _ pair)* _ "}" => \${ extractObject }

	[array]
		| "[" _ "]" => ( [] )
		| "[" _ value (_ "," _ value)* _ "]" => \${ extractArray }

	[value]
		| object => ( $0 )
		| array => ( $0 )
		| number => ( $0 )
		| string => ( $0 )
		| "true" => ( true )
		| "false" => ( false )
		| "null" => ( null )

	[number]
		| <number> => ( parseFloat($0.value) )

	[string]
		| <string> => ( JSON.parse($0.value) )

	[pair]
		| key@k _ ":" _ value@v => ( [$k, $v] )

	[key]
		| string => ( $0 )

}

on:import {
    function extractPair(kv, output) {
        if(kv[0]) { output[kv[0]] = kv[1]; }
    }

    function extractObject({data}) {
        let output = {};

        extractPair(data[2], output);

        for (let i in data[3]) {
            extractPair(data[3][i][3], output);
        }

        return output;
    }

    function extractArray({data}) {
        let output = [data[2]];

        for (let i in data[3]) {
            output.push(data[3][i][3]);
        }

        return output;
    }
}`

const javascriptsource = await Generate(source, {
    output: {
        name: 'grammar',
        format: 'typescript',
        artifacts: {
            lexer: true,
            grammar: true
        }
    }
});
```

## Performance & Scalability Report: The 100k "Grammar Well"

This sections documents the engine's performance limits when processing extreme-depth telemetry (100,000 nested nodes). 

### Infrastructure Profile
To ensure absolute resource isolation, tests were conducted on a dedicated high-memory cloud instance.

| Category     | Specification                                        |
| :----------- | :--------------------------------------------------- |
| **Provider** | **DigitalOcean (Memory-Optimized Droplet)**          |
| **Compute**  | 4 Dedicated vCPUs (Intel® Xeon® Gold 6248 @ 2.50GHz) |
| **Memory**   | 32 GB Dedicated RAM                                  |
| **Storage**  | 100 GB NVMe SSD                                      |
| **Runtime**  | Node.js v25.2.1 on Linux 6.8.0                       |

### V8 Runtime Configuration
Processing 100,000 nodes at depth generates a recursive call-stack that exceeds default Node.js and OS boundaries.

```bash
# 1. Unlock the OS-level stack limit
ulimit -s unlimited

# 2. Open a persistent session to prevent SSH timeout crashes
screen -L -Logfile benchmark.log -S benchmark

# 3. Launch the suite with tuned V8 stack/heap flags to stabilize the environment and prevent Segmentation Faults:
npm run benchmark -- --stack-size=65536 --max-old-space-size=28000
```

Workflow Tip: Use `CTRL + A + D` to detach the screen. You can safely close your terminal or monitor the output via:
```
tail -f benchmark.log
```


### JSON (1K Nodes)
|                             | Parsing Cold | Parsing Hot   | Stability (CV) | Memory Used | Parsing Iterations |
| --------------------------- | ------------ | ------------- | -------------- | ----------- | ------------------ |
| Lexer Only                  | 6.17         | 5.22 (±1.92)  | 36.8%          | 24.12 MB    | 100                |
| Earley Eager                | 40.36        | 37.15 (±5.37) | 14.5%          | 45.25 MB    | 100                |
| Earley Lazy                 | 46.27        | 42.59 (±4.75) | 11.1%          | 48.30 MB    | 100                |
| Earley Eager (Zero Epsilon) | 39.44        | 36.27 (±4.93) | 13.6%          | 40.29 MB    | 100                |
| Earley Lazy (Zero Epsilon)  | 39.19        | 35.67 (±6.31) | 17.7%          | 41.65 MB    | 100                |
| LR0 (Zero Epsilon)          | 19.72        | 12.96 (±3.28) | 25.3%          | 25.60 MB    | 100                |

### JSON (10K Nodes)
|                             | Parsing Cold | Parsing Hot     | Stability (CV) | Memory Used | Parsing Iterations |
| --------------------------- | ------------ | --------------- | -------------- | ----------- | ------------------ |
| Lexer Only                  | 32.27        | 31.49 (±2.17)   | 6.9%           | 56.12 MB    | 100                |
| Earley Eager                | 855.60       | 825.14 (±17.17) | 2.1%           | 270.32 MB   | 100                |
| Earley Lazy                 | 759.63       | 750.13 (±11.63) | 1.5%           | 186.92 MB   | 100                |
| Earley Eager (Zero Epsilon) | 246.72       | 236.36 (±7.41)  | 3.1%           | 85.53 MB    | 100                |
| Earley Lazy (Zero Epsilon)  | 267.39       | 262.59 (±6.62)  | 2.5%           | 94.25 MB    | 100                |
| LR0 (Zero Epsilon)          | 86.06        | 85.09 (±4.86)   | 5.7%           | 53.52 MB    | 100                |

### JSON (50K Nodes)
|                             | Parsing Cold | Parsing Hot        | Stability (CV) | Memory Used | Parsing Iterations |
| --------------------------- | ------------ | ------------------ | -------------- | ----------- | ------------------ |
| Lexer Only                  | 128.11       | 128.23 (±4.82)     | 3.8%           | 206.47 MB   | 10                 |
| Earley Eager                | 15647.68     | 15585.77 (±299.41) | 1.9%           | 5365.89 MB  | 10                 |
| Earley Lazy                 | 14665.24     | 14710.48 (±139.89) | 1.0%           | 1239.93 MB  | 10                 |
| Earley Eager (Zero Epsilon) | 1256.36      | 1216.06 (±21.39)   | 1.8%           | 161.81 MB   | 10                 |
| Earley Lazy (Zero Epsilon)  | 1388.78      | 1342.75 (±13.41)   | 1.0%           | 229.55 MB   | 10                 |
| LR0 (Zero Epsilon)          | 431.23       | 422.55 (±11.36)    | 2.7%           | 143.34 MB   | 10                 |

### JSON (100k Nodes)
|                             | Parsing Cold | Parsing Hot      | Stability (CV) | Memory Used | Parsing Iterations |
| --------------------------- | ------------ | ---------------- | -------------- | ----------- | ------------------ |
| Lexer Only                  | 226.86       | 224.91 (±6.51)   | 2.9%           | 281.19 MB   | 10                 |
| Earley Eager (Zero Epsilon) | 2259.98      | 2258.16 (±22.03) | 1.0%           | 227.75 MB   | 10                 |
| Earley Lazy (Zero Epsilon)  | 2569.49      | 2603.80 (±26.03) | 1.0%           | 353.09 MB   | 10                 |
| LR0 (Zero Epsilon)          | 717.48       | 753.08 (±17.29)  | 2.3%           | 176.64 MB   | 10                 |
