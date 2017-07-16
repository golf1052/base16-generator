'use strict';
import * as fs from 'fs';
import * as path from 'path';
var yaml = require('js-yaml');


let dir = fs.readdirSync(path.resolve('.'));
let schemesDirs = dir.filter(d => {
    return d.indexOf('.') == -1;
});

schemesDirs.forEach(schemeDir => {
    let files = fs.readdirSync(path.resolve('.', schemeDir));
    let schemes = files.filter(f => { return f.endsWith('.yaml'); });
    schemes.forEach(scheme => {
        let loadedScheme = yaml.safeLoad(fs.readFileSync(path.join('.', schemeDir, scheme), 'utf8'));
        console.log(loadedScheme.scheme);
    });
});

process.exit();