import * as fs from 'fs';
import * as path from 'path';
import * as jsonc from 'jsonc-parser';
import * as vscode from 'vscode';

const BASE_PATH = path.resolve(__dirname, '..', '..');
const PACKAGE_PATH = path.join(BASE_PATH, 'package.json');
const THEMES_PATH = path.join(BASE_PATH, 'themes');
const THEMES = fs.readdirSync(THEMES_PATH).map((f: string) => path.basename(f, '.json'));
const JSONC_MODIFICATION_OPTIONS: jsonc.ModificationOptions = {
    isArrayInsertion: false,
    formattingOptions: {
        tabSize: 2,
        insertSpaces: true,
    },
};

enum UITheme {
    light = 'vs',
    dark = 'vs-dark',
}

interface Theme {
    label: string;
    uiTheme: UITheme;
    path: string;
}

interface Base16Theme {
    name: string;
    type: keyof typeof UITheme;
}

interface ThemeCompareResult {
    equal: boolean;
    reordered: number;
    added: number;
    removed: number;
}

function toTheme(theme: Base16Theme, themePath: string): Theme {
    return {
        label: theme.name,
        uiTheme: UITheme[theme.type],
        path: path.relative(BASE_PATH, themePath),
    };
}

function readActivatedThemes(packageContent: string): string[] {
    const parseErrors: jsonc.ParseError[] = [];
    const packageInfo = jsonc.parse(packageContent, parseErrors);

    return packageInfo.contributes.themes.map((t: Theme) => path.basename(t.path, '.json'));
}

function getTheme(themeName: string): Theme {
    const parseErrors: jsonc.ParseError[] = [];
    const themePath = path.join(THEMES_PATH, themeName.replace(/^(.*?)(\.json)?$/, '$1.json'));
    const themeFile = fs.readFileSync(themePath, { encoding: 'utf8' });
    const themeBase16: Base16Theme = jsonc.parse(themeFile, parseErrors);

    return toTheme(themeBase16, themePath);
}

function getThemeQuickPickItem(themeName: string, picked: boolean): vscode.QuickPickItem {
    const theme = getTheme(themeName);
    return {
        label: theme.label,
        description: themeName,
        picked,
    };
}

export function getThemeItems(configuredThemes: string[]): vscode.QuickPickItem[] {
    const themeItems: vscode.QuickPickItem[] = [];

    for (const configuredTheme of configuredThemes) {
        themeItems.push(getThemeQuickPickItem(configuredTheme, true));
    }

    for (const theme of THEMES) {
        // Filter picked themes
        if (configuredThemes.includes(theme)) {
            continue;
        }

        themeItems.push(getThemeQuickPickItem(theme, false));
    }

    return themeItems;
}

export function getThemeItemsToDisable(configuredThemes: string[]): vscode.QuickPickItem[] {
    const themeItems: vscode.QuickPickItem[] = [];

    for (const theme of configuredThemes) {
        themeItems.push(getThemeQuickPickItem(theme, false));
    }

    return themeItems;
}

export function getThemeNames(): string[] {
    return [...THEMES];
}

export function compareThemes(configuredThemes: string[], activatedThemes: string[]): ThemeCompareResult {
    const length = Math.max(configuredThemes.length, activatedThemes.length);
    const added = [];
    const removed = [];

    let reordered = 0;

    for (let index = 0; index < length; index++) {
        const configuredTheme = configuredThemes[index];
        const activatedTheme = activatedThemes[index];

        // If they are equal go to next
        if (configuredTheme === activatedTheme) {
            continue;
        }

        // When outside of configurationTheme array; theme we must be removed
        if (!configuredTheme) {
            removed.push(activatedTheme);
            continue;
            // When outside of activatedTheme array; theme we must be added
        } else if (configuredTheme && !activatedTheme) {
            added.push(configuredTheme);
            continue;
        }

        // If we go here configure and active theme are not equal,
        // We look if exist in theme added
        const addedIndex = added.indexOf(configuredTheme);
        const removedIndex = removed.indexOf(activatedTheme);
        if (addedIndex >= 0) {
            reordered++;
            added.splice(addedIndex, 1);
        } else {
            reordered++;
            removed.splice(removedIndex, 1);
        }
    }

    return {
        equal:
            configuredThemes.length === activatedThemes.length &&
            added.length === 0 &&
            removed.length === 0 &&
            reordered === 0,
        reordered,
        added: added.length,
        removed: removed.length,
    };
}

export function writeActivatedThemes(themeNames: string[] = []): ThemeCompareResult {
    const packageContent = fs.readFileSync(PACKAGE_PATH, { encoding: 'utf8' });
    const activatedThemes = readActivatedThemes(packageContent);
    const compareResult = compareThemes(themeNames, activatedThemes);

    if (!compareResult.equal) {
        const themes = themeNames.map((t) => getTheme(t));

        const edits = jsonc.modify(packageContent, ['contributes', 'themes'], themes, JSONC_MODIFICATION_OPTIONS);
        const packageContentModified = jsonc.applyEdits(packageContent, edits);

        fs.writeFileSync(PACKAGE_PATH, packageContentModified, {
            encoding: 'utf8',
        });
    }

    return compareResult;
}

export async function promptRestart(informationMessage: string): Promise<void> {
    const reloadAction: vscode.MessageItem = { title: 'Reload Now' };
    const selectedAction = await vscode.window.showInformationMessage(informationMessage, reloadAction);

    if (!selectedAction || selectedAction.title !== reloadAction.title) {
        return;
    }

    if (selectedAction.title == reloadAction.title) {
        await vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
}

export async function promptPickItems(themes: vscode.QuickPickItem[]): Promise<string[]> {
    const selectedThemes = await vscode.window.showQuickPick(themes, {
        ignoreFocusOut: false,
        matchOnDescription: false,
        matchOnDetail: false,
        placeHolder: 'Search a theme',
        canPickMany: true,
    });

    if (!selectedThemes) return [];

    return selectedThemes.map((item) => item.description || '');
}
