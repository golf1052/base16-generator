import * as fs from 'fs';
import * as path from 'path';
import * as jsonc from 'jsonc-parser';
import * as generate_light_schemes from './generate-light-schemes';

export function main(): void {
    mainWithDir('.');
}

export function mainWithDir(workingDirectory: string): void {
    let dir = fs.readdirSync(path.resolve(workingDirectory));
    let files = dir.filter(d => {
        return d.endsWith('.json');
    });

    files.forEach(f => {
        const json = jsonc.parse(fs.readFileSync(path.resolve(workingDirectory, f), 'utf8'));
        if (!generate_light_schemes.isColorDark(json['colors']['editor.background'])) {
            json.type = 'light';
        }
        fs.writeFileSync(path.resolve(workingDirectory, f), JSON.stringify(json, null, 4));
    });
}

// main();
