import * as vscode from 'vscode';
import {
    compareThemes,
    getThemeItems,
    getThemeItemsToDisable,
    promptPickItems,
    promptRestart,
    getThemeNames,
    writeActivatedThemes,
} from './utils';

export function activate(context: vscode.ExtensionContext): void {
    const disposables: vscode.Disposable[] = [
        vscode.commands.registerCommand('base16.generator.activateTheme', () => activateTheme()),
        vscode.commands.registerCommand('base16.generator.deactivateTheme', () => deactivateTheme()),
        vscode.commands.registerCommand('base16.generator.activateAllThemes', () => activateAllThemes()),
        vscode.commands.registerCommand('base16.generator.deactivateAllThemes', () => deactivateAllThemes()),
        vscode.workspace.onDidChangeConfiguration((e) => onDidChangeConfiguration(e)),
    ];

    // Register disposables for deactivate function
    context.subscriptions.push(...disposables);

    // If updating or reinstalling, it will generate themes from settings
    applyChanges();
}

async function activateTheme() {
    let configThemes = vscode.workspace.getConfiguration().get('base16.generator.activatedThemes') as string[];
    const themeItems = getThemeItems(configThemes);
    const selectedThemes = await promptPickItems(themeItems);
    const compareResult = compareThemes(selectedThemes, configThemes);

    if (compareResult.equal) {
        vscode.window.showInformationMessage('Base16 theme has no changes made.');
        return;
    }

    await vscode.workspace.getConfiguration().update('base16.generator.activatedThemes', selectedThemes, true);
}

async function deactivateTheme() {
    const configThemes = vscode.workspace.getConfiguration().get('base16.generator.activatedThemes') as string[];

    if (!configThemes) {
        vscode.window.showInformationMessage('Base16 theme has no theme to deactivate.');
        return;
    }

    const themeItems = getThemeItemsToDisable(configThemes);
    const selectedThemes = await promptPickItems(themeItems);

    if (!selectedThemes.length) {
        vscode.window.showInformationMessage('Base16 theme has no changes made.');
        return;
    }

    const nextConfigThemes = configThemes.filter((t) => !selectedThemes.includes(t));
    const target = vscode.ConfigurationTarget.Global;
    await vscode.workspace.getConfiguration().update('base16.generator.activatedThemes', nextConfigThemes, target);
}

async function activateAllThemes() {
    const configThemes = vscode.workspace.getConfiguration().get('base16.generator.activatedThemes') as string[];
    const allThemes = getThemeNames();
    const compareResult = compareThemes(allThemes, configThemes);

    if (compareResult.equal) {
        vscode.window.showInformationMessage('Base16 theme has no changes made.');
        return;
    }

    const target = vscode.ConfigurationTarget.Global;
    await vscode.workspace.getConfiguration().update('base16.generator.activatedThemes', allThemes, target);
}

async function deactivateAllThemes() {
    const configThemes = vscode.workspace.getConfiguration().get('base16.generator.activatedThemes') as string[];

    if (!configThemes.length) {
        vscode.window.showInformationMessage('Base16 theme has no changes made.');
        return;
    }

    const target = vscode.ConfigurationTarget.Global;
    await vscode.workspace.getConfiguration().update('base16.generator.activatedThemes', [], target);
}

async function onDidChangeConfiguration(e: vscode.ConfigurationChangeEvent) {
    if (e.affectsConfiguration('base16.generator.activatedThemes')) {
        applyChanges();
    }
}

async function applyChanges() {
    const themes = vscode.workspace.getConfiguration().get('base16.generator.activatedThemes') as string[];
    const result = writeActivatedThemes(themes);

    if (result.equal) {
        return;
    }

    const resultStrings = [];
    if (result.added) {
        resultStrings.push(`${result.added} Added`);
    }
    if (result.removed) {
        resultStrings.push(`${result.removed} Removed`);
    }
    if (!result.added && !result.removed && result.reordered) {
        resultStrings.push(`${result.reordered} Ordered`);
    }

    await promptRestart(`Base16 theme has changed (${resultStrings.join(', ')}). Please restart VSCode.`);
}

export function deactivate(): void {
}
