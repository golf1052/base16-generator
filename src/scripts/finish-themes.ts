'use strict';
import * as fs from 'fs';
import * as path from 'path';
var cjson = require('strip-json-comments');

export function main(): void {
    mainWithDir('.');
}

export function mainWithDir(workingDirectory: string): void {
    let dir = fs.readdirSync(path.resolve(workingDirectory));
    let files = dir.filter(d => {
        return d.endsWith('.json');
    });
    
    files.forEach(f => {
        let json = JSON.parse(cjson(fs.readFileSync(path.resolve(workingDirectory, f), 'utf8')));
        if (f.indexOf('-light') != -1) {
            json.type = 'light';
        }
        fs.writeFileSync(path.resolve(workingDirectory, f), JSON.stringify(json, null, 4));
    });
}

main();
