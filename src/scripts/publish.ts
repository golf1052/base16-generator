import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path'

function main(): void {
    const dir = path.resolve(__filename, '../../../..');
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(dir, 'package.json'), 'utf8'));
    const version = packageJson.version;
    const packageFileName = `base16-generator-${version}.vsix`;

    try {
        fs.accessSync(path.resolve(dir, packageFileName));
    } catch {
        console.error(`${packageFileName} does not exist. Did you run "vsce package" first?`);
        process.exit(1);
    }
    
    if (!process.env.OVSX_TOKEN) {
        console.error('Open VSX token not set in environment variables. Please set OVSX_TOKEN.');
        process.exit(1);
    }

    const options: child_process.ExecSyncOptionsWithStringEncoding = {
        cwd: dir,
        encoding: 'utf8'
    };

    try {
        child_process.execSync('vsce publish', options);
    } catch (err) {
        printError(err as Error);
    }

    try {
        child_process.execSync(`ovsx publish ${packageFileName} -p ${process.env.OVSX_TOKEN}`, options);
    } catch (err) {
        printError(err as Error);
    }
}

function printError(err: Error): void {
    console.error(err.name);
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
}

main();
