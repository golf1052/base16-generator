import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import * as rimraf from 'rimraf';
import * as generate_light_schemes from './generate-light-schemes';
import * as finish_themes from './finish-themes';
import * as list_themes from './list-themes';
import recursive_copy from 'recursive-copy';
import * as mkdirp from 'mkdirp';

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

    let updatedTemplateFile = path.resolve(dir, '../../builder/templates/vscode/templates/default.mustache');
    let schemesDir = path.join(dir, 'sources/schemes');
    let themesDir = path.resolve(dir, '../../themes');

    // Copy user updated template to builder template directory
    copy(updatedTemplateFile, path.join(dir, 'sources/templates/vscode/templates/default.mustache'))
        .then(() => {
            // Generate light schemes
            generate_light_schemes.mainWithDir(schemesDir);

            // Build templates
            try {
                child_process.execSync('base16-builder build --template vscode', options);
            }
            catch (e) {
                printE(e);
            }
            
            try {
                // Make sure themes dir exists
                fs.mkdirSync(themesDir);
            } catch {
            }
            
            // Empty the themes dir
            fs.readdirSync(themesDir).forEach(file => {
                fs.unlinkSync(path.join(themesDir, file));
            });

            // Copy themes
            return copy(path.join(dir, 'themes/vscode/themes'), themesDir)
        })
        .then(() => {
            // Finally, finish themes
            finish_themes.mainWithDir(themesDir);

            // also update themes list
            list_themes.mainWithDir(schemesDir);

            // and copy the result over to the right place
            return copy(path.join(schemesDir, 'themes.md'), path.resolve(dir, '../../themes.md'));
        })
        .then(() => {
            // garbage is bad
            rimraf.sync(dir);
            console.log('Done!');
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
    process.exit(1);
}

main();
