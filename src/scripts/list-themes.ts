import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export function main(): void {
    mainWithDir('.');
}

export function mainWithDir(workingDirectory: string): void {
    let resolvedWorkingDirectory = path.resolve(workingDirectory);
    let dir = fs.readdirSync(resolvedWorkingDirectory);
    let schemes = dir.filter(f => {
        return f.endsWith('yaml');
    });

    let themesList: string = '';
    themesList += '# Available Themes\n\n';
    
    schemes.forEach(scheme => {
        let loadedScheme: any = yaml.load(fs.readFileSync(path.join(resolvedWorkingDirectory, scheme), 'utf8'));
        console.log(loadedScheme.scheme);
        themesList += (`${loadedScheme.scheme}  \n`);
    });
    fs.writeFileSync(path.join(resolvedWorkingDirectory, 'themes.md'), themesList);
}

// main();
