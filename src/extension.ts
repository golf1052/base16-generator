import * as vscode from 'vscode';
import * as helpers from './extension-helpers';

const ConfigurationPropertyName: string = 'base16.generator.activatedThemes';

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

    // If updating or reinstalling, we'll activate themes from user settings
    applyChanges();
}

async function activateTheme() {
    let configThemes = vscode.workspace.getConfiguration().get(ConfigurationPropertyName) as string[];
    const themeItems = helpers.getThemeItems(configThemes);
    const selectedThemes = await helpers.promptPickItems(themeItems);
    const compareResult = helpers.compareThemes(selectedThemes, configThemes);

    if (compareResult.equal) {
        vscode.window.showInformationMessage('No themes to activate.');
        return;
    }

    await vscode.workspace.getConfiguration().update(ConfigurationPropertyName,
        selectedThemes,
        vscode.ConfigurationTarget.Global);
}

async function deactivateTheme() {
    const configThemes = vscode.workspace.getConfiguration().get(ConfigurationPropertyName) as string[];

    if (!configThemes) {
        vscode.window.showInformationMessage('No themes to deactivate.');
        return;
    }

    const themeItems = helpers.getThemeItemsToDisable(configThemes);
    const selectedThemes = await helpers.promptPickItems(themeItems);

    if (!selectedThemes.length) {
        vscode.window.showInformationMessage('No themes to deactivate.');
        return;
    }

    const updatedConfigThemes = configThemes
        .filter((t) => !selectedThemes.includes(t))
        .sort((a, b) => a.localeCompare(b));

    await vscode.workspace.getConfiguration().update(ConfigurationPropertyName,
        updatedConfigThemes,
        vscode.ConfigurationTarget.Global);
}

async function activateAllThemes() {
    const allThemes = helpers.getAllThemeNames();
    await vscode.workspace.getConfiguration().update(ConfigurationPropertyName,
        allThemes,
        vscode.ConfigurationTarget.Global);
}

async function deactivateAllThemes() {
    const configThemes = vscode.workspace.getConfiguration().get(ConfigurationPropertyName) as string[];

    if (!configThemes.length) {
        vscode.window.showInformationMessage('No themes to deactivate.');
        return;
    }

    await vscode.workspace.getConfiguration().update(ConfigurationPropertyName, [], vscode.ConfigurationTarget.Global);
}

async function onDidChangeConfiguration(e: vscode.ConfigurationChangeEvent) {
    if (e.affectsConfiguration(ConfigurationPropertyName)) {
        applyChanges();
    }
}

async function applyChanges() {
    const themes = vscode.workspace.getConfiguration().get(ConfigurationPropertyName) as string[];
    const themesDeduped = [...new Set(themes)];
    const validThemes = helpers.getValidThemeNames(themesDeduped);
    const activeThemes = helpers.getActiveThemesInPackage();
    // Check if new valid themes have been added to settings (we check for valid themes to avoid modifying settings if a
    // user is entering a theme in the JSON settings file and has autosave enabled) or if there are any duplicate themes
    if (!helpers.arrayEquals(validThemes, activeThemes) || !helpers.arrayEquals(themes, themesDeduped)) {
        themesDeduped.sort((a, b) => a.localeCompare(b));

        // This check makes it so we only prompt to reload if there were new non-duplicate themes added
        if (!helpers.arrayEquals(validThemes, activeThemes)) {
            const updatedThemes = helpers.writeActivatedThemes(themesDeduped);
            await vscode.workspace.getConfiguration().update(ConfigurationPropertyName,
                updatedThemes,
                vscode.ConfigurationTarget.Global);
            await promptRestart(`Base16 theme has changed. Please restart VSCode.`);
        } else {
            await vscode.workspace.getConfiguration().update(ConfigurationPropertyName,
                activeThemes,
                vscode.ConfigurationTarget.Global);
        }
    }
}

async function promptRestart(informationMessage: string): Promise<void> {
    const reloadAction: vscode.MessageItem = { title: 'Reload Now' };
    const selectedAction = await vscode.window.showInformationMessage(informationMessage, reloadAction);

    if (!selectedAction || selectedAction.title !== reloadAction.title) {
        return;
    }

    if (selectedAction.title == reloadAction.title) {
        await vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
}

export function deactivate(): void {
}
