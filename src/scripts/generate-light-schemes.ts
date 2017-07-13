'use strict';
import * as fs from 'fs';
import * as path from 'path';
var yaml = require('js-yaml');

enum VersionToCreate {
    Dark,
    Light
}

// read the directory
let dir = fs.readdirSync(__dirname);

// then filter out everything that isn't a folder
let schemesDirs = dir.filter(d => {
    return d.indexOf('.') == -1;
});

let filesToDelete: string[] = [];

schemesDirs.forEach(schemeDir => {
    // then for each scheme folder read the directory
    let files = fs.readdirSync(path.join(__dirname, schemeDir));
    
    // filter out anything that isn't a .yaml file
    let schemes = files.filter(f => {
        return f.endsWith('.yaml');
    });

    let lightVersions: string[] = [];
    let namedDarkVersions: string[] = [];
    // now check if there are already light or named dark variants
    // we assume things without a postfix are dark versions
    schemes.forEach(scheme => {
        if (scheme.indexOf('-light') != -1) {
            lightVersions.push(scheme);
        }
        else if (scheme.indexOf('-dark') != -1) {
            namedDarkVersions.push(scheme);
        }
    });

    // then create and polish the light and dark files
    schemes.forEach(scheme => {
        let pathToSchemeFolder = path.join(__dirname, schemeDir);
        if (lightVersions.indexOf(scheme) != -1) {
            if (namedDarkVersions.length == 0) {
                let darkVersion: string = scheme.replace('-light', '');
                if (schemes.indexOf(darkVersion) == -1) {
                    // if the dark version doesn't exist create it
                    console.log(`Creating dark version from light version: ${scheme}`);
                    reverseAndPolishScheme(scheme, pathToSchemeFolder, true, VersionToCreate.Dark, true);
                }
            }
            return;
        }
        if (lightVersions.indexOf(appendStringToFilename(scheme, '-light')) == -1) {
            // create reversed (light) file
            console.log(`Creating light version from dark version: ${scheme}`);
            reverseAndPolishScheme(scheme, pathToSchemeFolder, true, VersionToCreate.Light, true);
        }
        if (namedDarkVersions.indexOf(scheme) == -1) {
            // also polish dark file scheme name
            console.log(`Polishing dark version: ${scheme}`);
            reverseAndPolishScheme(scheme, pathToSchemeFolder, false, VersionToCreate.Dark, true);
        } 
    });

    filesToDelete.forEach(file => {
        fs.unlinkSync(file);
    });
    filesToDelete = [];
});

function reverseAndPolishScheme(schemeFile: string,
    pathToSchemeFolder: string,
    reverseFile: boolean,
    versionToCreate: VersionToCreate,
    appendVersionToTitle: boolean): void {
    let loadedScheme = yaml.safeLoad(fs.readFileSync(path.join(pathToSchemeFolder, schemeFile), 'utf8'));
    let strippedFileName: string = schemeFile.replace('-light', '').replace('-dark', '');
    let newFileName: string = '';
    console.log(`Processing ${schemeFile}`);
    if (reverseFile) {
        console.log(`Reversing`);
        let greyColors: string[] = [];
        for (let i = 0; i < 8; i++) {
            greyColors.push(loadedScheme['base0' + i]);
        }
        greyColors.reverse();
        for (let i = 0; i < 8; i++) {
            loadedScheme['base0' + i] = greyColors[i];
        }
    }
    if (appendVersionToTitle) {
        if (versionToCreate == VersionToCreate.Dark) {
            console.log(`Appending dark to title`);
            loadedScheme['scheme'] += ' Dark';
        }
        else if (versionToCreate == VersionToCreate.Light) {
            console.log(`Appending light to title`);
            loadedScheme['scheme'] += ' Light';
        }
    }
    if (versionToCreate == VersionToCreate.Dark) {
        newFileName = appendStringToFilename(strippedFileName, '-dark');
    }
    else if (versionToCreate == VersionToCreate.Light) {
        newFileName = appendStringToFilename(strippedFileName, '-light');
    }
    console.log(`Creating new file and deleting old file: ${newFileName}`);
    fs.writeFileSync(path.join(pathToSchemeFolder, newFileName), yaml.safeDump(loadedScheme));
    if (filesToDelete.indexOf(path.join(pathToSchemeFolder, schemeFile)) == -1) {
        // filesToDelete.push(path.join(pathToSchemeFolder, schemeFile));
    }
}

function appendStringToFilename(filename: string, str: string): string {
    let splitNumber = (filename.length - filename.lastIndexOf('.')) * -1;
    return filename.slice(0, splitNumber) + str + filename.slice(splitNumber);
}