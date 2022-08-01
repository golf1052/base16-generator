import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import cjson from 'strip-json-comments';

export function activate(context: vscode.ExtensionContext) {
    let activateThemeCommand = vscode.commands.registerCommand('base16.generator.activateTheme', function () {
        activateTheme();
    });
    let deactivateThemeCommand = vscode.commands.registerCommand('base16.generator.deactivateTheme', function() {
        deactivateTheme();
    });
    let activateAllThemesCommand = vscode.commands.registerCommand('base16.generator.activateAllThemes', function() {
        activateAllThemes();
    });
    let deactivateAllThemesCommand = vscode.commands.registerCommand('base16.generator.deactivateAllThemes', function() {
        deactivateAllThemes();
    });

    context.subscriptions.push(activateThemeCommand);
    context.subscriptions.push(deactivateThemeCommand);
    context.subscriptions.push(activateAllThemesCommand);
    context.subscriptions.push(deactivateAllThemesCommand);
}

async function activateTheme(): Promise<void> {
    const themesDir: string = path.resolve(__dirname, '../../themes');
    const themes = fs.readdirSync(themesDir);
    const themesList: vscode.QuickPickItem[] = themes.map(t => {
        const loadedTheme = parseJson(fs.readFileSync(path.join(themesDir, t), 'utf8'));
        const item: vscode.QuickPickItem = {
            label: loadedTheme.name,
            description: t
        };
        return item;
    });

    const selectedThemes: vscode.QuickPickItem[] | undefined = await vscode.window.showQuickPick(themesList, {
        ignoreFocusOut: false,
        matchOnDescription: false,
        matchOnDetail: false,
        placeHolder: 'Base16 Default Dark',
        canPickMany: true
    });

    if (!selectedThemes) {
        return;
    }

    const packageInfo = getPackageInfo();
    let numberOfThemesActivated: number = 0;
    for (const selectedTheme of selectedThemes) {
        if (!selectedTheme.description) {
            continue;
        }
        const themeFile = parseJson(fs.readFileSync(path.join(themesDir, selectedTheme.description), 'utf8'));
        let themeType: string = 'vs-dark';
        if (themeFile.type == 'dark') {
            themeType = 'vs-dark';
        } else if (themeFile.type == 'light') {
            themeType = 'vs';
        }

        const theme = {
            label: selectedTheme.label,
            uiTheme: themeType,
            path: './themes/' + selectedTheme.description
        };
        packageInfo.contributes.themes.push(theme);
        numberOfThemesActivated += 1;
    }
    
    writePackageInfo(packageInfo);

    let restartString = '';
    if (numberOfThemesActivated == 1) {
        restartString = `${numberOfThemesActivated} Base16 theme has been activated. Please restart VSCode and then go to Preferences: Color Theme.`;
    } else {
        restartString = `${numberOfThemesActivated} Base16 themes have been activated. Please restart VSCode and then go to Preferences: Color Theme.`;
    }

    await promptRestart(restartString);
}

async function activateAllThemes(): Promise<void> {
    const themesDir: string = path.resolve(__dirname, '../../themes');
    const themes = fs.readdirSync(themesDir);

    const packageInfo = getPackageInfo();
    packageInfo.contributes.themes = [];

    for (const theme of themes) {
        const themeFile = parseJson(fs.readFileSync(path.join(themesDir, theme), 'utf8'));
        let themeType: string = 'vs-dark';
        if (themeFile.type == 'dark') {
            themeType = 'vs-dark';
        } else if (themeFile.type == 'light') {
            themeType = 'vs';
        }

        const extensionTheme = {
            label: themeFile.name,
            uiTheme: themeType,
            path: './themes/' + theme
        };
        packageInfo.contributes.themes.push(extensionTheme);
    }

    writePackageInfo(packageInfo);

    await promptRestart('All Base16 themes have been activated. Please restart VSCode and then go to Preferences: Color Theme.');
}

async function deactivateTheme(): Promise<void> {
    const packageInfo = getPackageInfo();
    if (packageInfo.contributes.themes.length == 0) {
        vscode.window.showInformationMessage('No themes to deactivate.');
        return;
    }

    const activatedThemes: vscode.QuickPickItem[] = packageInfo.contributes.themes.map((theme: any) => {
        let themePathSplit: string[] = theme.path.split('/');
        let themeJson: string = themePathSplit[themePathSplit.length - 1];

        let item: vscode.QuickPickItem = {
            label: theme.label,
            description: themeJson
        };
        return item;
    });

    const deactivatedThemes: vscode.QuickPickItem[] | undefined = await vscode.window.showQuickPick(activatedThemes, {
        ignoreFocusOut: false,
        matchOnDescription: false,
        matchOnDetail: false,
        canPickMany: true
    });

    if (!deactivatedThemes) {
        return;
    }

    let numberOfThemesDeactivated: number = 0;
    for (const theme of deactivatedThemes) {
        for (let i = 0; i < packageInfo.contributes.themes.length; i++) {
            const packageInfoTheme = packageInfo.contributes.themes[i];
            if (packageInfoTheme.label == theme.label) {
                packageInfo.contributes.themes.splice(i, 1);
                i -= 1;
                numberOfThemesDeactivated += 1;
                break;
            }
        }
    }

    writePackageInfo(packageInfo);

    let restartString = '';
    if (numberOfThemesDeactivated == 1) {
        restartString = `${numberOfThemesDeactivated} Base16 theme has been deactivated. Please restart VSCode.`;
    } else {
        restartString = `${numberOfThemesDeactivated} Base16 themes have been deactivated. Please restart VSCode.`;
    }

    await promptRestart(restartString);
}

async function deactivateAllThemes(): Promise<void> {
    const packageInfo = getPackageInfo();
    if (packageInfo.contributes.themes.length == 0) {
        vscode.window.showInformationMessage('No themes to deactivate.');
        return;
    }

    packageInfo.contributes.themes = [];
    writePackageInfo(packageInfo);
    await promptRestart('All Base16 themes have been deactivated. Please restart VSCode.');
}

function getPackageInfo(): any {
    return parseJson(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
}

function writePackageInfo(packageInfo: any): void {
    fs.writeFileSync(path.resolve(__dirname, '../../package.json'), JSON.stringify(packageInfo, null, 2));
}

async function promptRestart(informationMessage: string): Promise<void> {
    let reloadAction: vscode.MessageItem = {title: 'Reload Now'};
    let selectedAction = await vscode.window.showInformationMessage(informationMessage, reloadAction);
    if (!selectedAction) {
        return;
    }
    if (selectedAction.title == reloadAction.title) {
        await vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
}

function parseJson(text: string) {
    return JSON.parse(cjson(text));
}

export function deactivate() {
}
