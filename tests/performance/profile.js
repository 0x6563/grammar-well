const { GetFile, GrammarWellRunner, NearleyRunner } = require("./testbed");
const blank = "".padEnd(100, ' ');
const offset = 10;
let currentLine = blank;

(async () => {
	const gw = await GrammarWellRunner(GetFile('../samples/grammars/profile.ne'));
	const ne = await NearleyRunner(GetFile('../samples/grammars/profile.ne'));


	function overwrite(line, text, pad) {
		const l = line.split('');
		for (let i = 0; i < text.length; i++) {
			const t = text[i];
			l[pad + i] = t;
		}
		return l.join('');
	}

	function runTest(runner, n, type) {
		let test = "";
		for (let i = 0; i < n; i++) {
			test += "(";
		}
		test += "acowcowcowcowcowcowcowcowcow";
		for (let i = 0; i < n; i++) {
			test += ")";
		}
		const starttime = process.hrtime();
		const startmemory = process.memoryUsage().heapUsed;
		const p = runner(test);
		console.assert(p);
		if (type === 'TIME') {
			const tdiff = process.hrtime(starttime)[1];
			return Math.round(tdiff / 1e9 * 80);
		} else {
			const mdiff = process.memoryUsage().heapUsed - startmemory;
			return Math.round(mdiff / 1e8 * 80);
		}
	}

	function profile(type) {
		for (let i = 0; i < 5e4; i += 2e3) {
			currentLine = overwrite(blank, '|', offset - 1);
			if (i % 1e4 === 0) {
				currentLine = overwrite(currentLine, i.toString(), 0);
			}
			const n1 = runTest(gw, i, type);
			const n2 = runTest(ne, i, type);
			if (n1 == n2) {
				currentLine = overwrite(currentLine, "+", Math.max(n1, 0) + offset);
			} else {
				currentLine = overwrite(currentLine, "G", Math.max(n1, 0) + offset);
				currentLine = overwrite(currentLine, "N", Math.max(n2, 0) + offset);
			}
			console.log(currentLine);
		}
	}

	console.log("=============");
	console.log("Tests operate on the grammar p -> \"(\" p \")\" | [a-z]");
	console.log("An input of size n is 2n+1 characters long, and of the form (((...a...))).");
	console.log("Plots \"G\", \"N\" for Grammar Well and Nearley respectively. \"+\" indicates both.");
	console.log();


	console.log("Running time tests.");
	console.log("-------------------");
	console.log("Each plot corresponds to the time taken to parse an input of that size with a recursive grammar.");
	console.log();
	currentLine = blank;
	currentLine = overwrite(currentLine, "SCALE", 0 + offset);
	currentLine = overwrite(currentLine, "0.25s", 20 + offset);
	currentLine = overwrite(currentLine, "0.50s", 40 + offset);
	currentLine = overwrite(currentLine, "0.75s", 60 + offset);
	currentLine = overwrite(currentLine, "1.00s", 80 + offset);
	console.log(currentLine);
	profile("TIME");


	console.log("Running memory tests.");
	console.log("-------------------");
	console.log("Each plot corresponds to the memory taken to parse an input of that size with a recursive grammar.");
	console.log("Occasional outliers may be caused by gc runs. Profiling doesn't explicitly call the gc before each run.");
	console.log();

	currentLine = blank;
	currentLine = overwrite(currentLine, "SCALE", 0 + offset);
	currentLine = overwrite(currentLine, "025MB", 20 + offset);
	currentLine = overwrite(currentLine, "050MB", 40 + offset);
	currentLine = overwrite(currentLine, "075MB", 60 + offset);
	currentLine = overwrite(currentLine, "100MB", 80 + offset);
	console.log(currentLine);

	profile("MEMO");

})()
