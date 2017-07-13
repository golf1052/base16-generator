'use strict';
import * as fs from 'fs';
import * as path from 'path';
var cjson = require('strip-json-comments');

let dir = fs.readdirSync(__dirname);
let files = dir.filter(d => {
    return d.endsWith('.json');
})

files.forEach(f => {
    let json = JSON.parse(cjson(fs.readFileSync(path.join(__dirname, f), 'utf8')));
    if (f.indexOf('light') != -1) {
        json.type = 'light';
    }
    fs.writeFileSync(path.join(__dirname, f), JSON.stringify(json, null, 4));
});