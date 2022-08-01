'use strict';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export function main(): void {
    mainWithDir('.');
}

export function mainWithDir(workingDirectory: string): void {
    let resolvedWorkingDirectory = path.resolve(workingDirectory);
    let dir = fs.readdirSync(resolvedWorkingDirectory);
    let schemesDirs = dir.filter(d => {
        return d.indexOf('.') == -1;
    });

    let themesList: string = '';
    themesList += '# Available Themes\n\n';
    
    schemesDirs.forEach(schemeDir => {
        let files = fs.readdirSync(path.resolve(workingDirectory, schemeDir));
        let schemes = files.filter(f => { return f.endsWith('.yaml'); });
        schemes.forEach(scheme => {
            let loadedScheme: any = yaml.load(fs.readFileSync(path.join(resolvedWorkingDirectory, schemeDir, scheme), 'utf8'));
            console.log(loadedScheme.scheme);
            themesList += (`${loadedScheme.scheme}  \n`);
        });
    });
    fs.writeFileSync(path.join(resolvedWorkingDirectory, 'themes.md'), themesList);
}

main();
