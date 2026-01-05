export function MarkdownTable(rows: any[], columns: Column[]) {
    const accessors = columns.map(v => typeof v.value == 'function' ? v.value : (row: any) => row[v.value as string]);
    const widths: number[] = columns.map(v => v.label.length);
    const values = [];
    for (const row of rows) {
        const r = [];
        for (let i = 0; i < accessors.length; i++) {
            const v = accessors[i](row)?.toString();
            r.push(v);
            widths[i] = Math.max(widths[i], v.length)
        }
        values.push(r);
    }
    let output = `| ${Row(columns.map(v => v.label), widths).join(' | ')} |\n`;
    output += `| ${Row(widths.map(v => ''), widths,'-').join(' | ')} |` + '\n';
    for (const row of values) {
        output += `| ${Row(row, widths).join(' | ')} |` + '\n';

    }
    return output;
}

function Row(row: any[], widths: number[], pad: string = ' ') {
    const cols = [];
    for (let i = 0; i < widths.length; i++) {
        cols.push((row[i] || '').toString().padEnd(widths[i], pad));
    }
    return cols;
}

interface Column {
    label: string;
    value: string | number | ((row: any) => string | number);
}