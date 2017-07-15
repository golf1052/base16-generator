'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
var cjson = require('strip-json-comments');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.activateTheme', async () => {
        await activateTheme();
    });

    context.subscriptions.push(disposable);
}

async function activateTheme() {
    let themesDir: string = path.resolve(__dirname, '../../themes');
    let themes = fs.readdirSync(themesDir);
    let themesList: vscode.QuickPickItem[] = themes.map(t => {
        let loadedTheme = parseJson(fs.readFileSync(path.join(themesDir, t), 'utf8'));
        let item: vscode.QuickPickItem = {
            label: loadedTheme.name,
            description: t
        };
        return item;
    });
    let options: vscode.QuickPickOptions = {
        ignoreFocusOut: false,
        matchOnDescription: false,
        matchOnDetail: false,
        placeHolder: 'Base16 Ocean Dark'
    };
    let selectedTheme = await vscode.window.showQuickPick(themesList, options);
    if (!selectedTheme) {
        return;
    }
    let packageInfo = parseJson(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
    let themeFile = parseJson(fs.readFileSync(path.resolve(__dirname, '../../themes/' + selectedTheme.description), 'utf8'));
    let themeType: string = 'vs-dark';
    if (themeFile.type == 'dark') {
        themeType = 'vs-dark';
    }
    else if (themeFile.type  == 'light') {
        themeType = 'vs';
    }
    packageInfo.contributes.themes[0] = {
        label: selectedTheme.label,
        uiTheme: themeType,
        path: './themes/' + selectedTheme.description
    };
    fs.writeFileSync(path.resolve(__dirname, '../../package.json'), JSON.stringify(packageInfo, null, 2));
    vscode.window.showInformationMessage(`${selectedTheme.label} has been activated. Please restart VSCode and then go to Preferences: Color Theme.`);
}

function parseJson(text: string) {
    return JSON.parse(cjson(text));
}

// this method is called when your extension is deactivated
export function deactivate() {
}