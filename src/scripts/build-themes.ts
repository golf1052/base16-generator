'use strict';
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import * as rimraf from 'rimraf';
import * as generate_light_schemes from './generate-light-schemes';
import * as finish_themes from './finish-themes';
var recursive_copy = require('recursive-copy');
var mkdirp = require('mkdirp');

function main(): void {
    // First make a working directory
    let dir = path.resolve('__dirname', '../../../working');
    if (fs.existsSync(dir)) {
        rimraf.sync(dir);
    }
    mkdirp.sync(dir);

    // Make sure builder is updated.
    let options: child_process.ExecSyncOptionsWithStringEncoding = {
        cwd: dir,
        encoding: 'utf8'
    };

    try {
        child_process.execSync('base16-builder update', options);
    }
    catch (e) {
        printE(e);
    }

    // Generate light schemes
    generate_light_schemes.mainWithDir(path.join(dir, 'sources/schemes'));

    // Build templates
    try {
        child_process.execSync('base16-builder build --template vscode', options);
    }
    catch (e) {
        printE(e);
    }

    // Empty the themes dir
    let themesDir = path.resolve(dir, '../../themes');
    fs.readdirSync(themesDir).forEach(file => {
        fs.unlinkSync(path.join(themesDir, file));
    });

    // Copy themes
    copy(path.join(dir, 'themes/vscode/themes'), themesDir)
        .then(() => {
            // Finally, finish themes
            finish_themes.mainWithDir(themesDir);
        });
}

async function copy(src: string, dest: string): Promise<void> {
    var options: any = {
        overwrite: true
    };
    await recursive_copy(src, dest, options);
}

function printE(e: any): void {
    const err: Error = e;
    printError(err);
}

function printError(err: Error): void {
    console.error(err.name);
    console.error(err.message);
    console.error(err.stack);
    process.exit(-1);
}

main();
