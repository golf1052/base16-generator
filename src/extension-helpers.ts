import * as fs from 'fs';
import * as path from 'path';
import * as jsonc from 'jsonc-parser';
import * as vscode from 'vscode';

const BASE_PATH = path.resolve(__dirname, '..', '..');
const PACKAGE_PATH = path.join(BASE_PATH, 'package.json');
const THEMES_PATH = path.join(BASE_PATH, 'themes');
const THEMES = fs.readdirSync(THEMES_PATH).map((f: string) => getThemeNameFromThemePath(f));
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
        path: themePath
    };
}

export function getActiveThemesInPackage(): string[] {
    const packageContent = fs.readFileSync(PACKAGE_PATH, { encoding: 'utf8' });
    const parseErrors: jsonc.ParseError[] = [];
    const packageInfo = jsonc.parse(packageContent, parseErrors);
    return packageInfo.contributes.themes.map((t: Theme) => getThemeNameFromTheme(t));
}

function getTheme(themeName: string): Theme | null {
    const parseErrors: jsonc.ParseError[] = [];
    // Gets the filename of the theme without .json
    // Group 1 is the filename of the theme without .json
    // https://regex101.com/r/kwMkAN/1
    const themeNameRegex = /^(.*?)(\.json)?$/;
    const normalizedThemeName = themeName.replace(themeNameRegex, '$1');
    const normalizedThemeFileName = `${normalizedThemeName}.json`;
    const themePath = path.join(THEMES_PATH, normalizedThemeFileName);
    try {
        const themeFile = fs.readFileSync(themePath, { encoding: 'utf8' });
        const themeBase16: Base16Theme = jsonc.parse(themeFile, parseErrors);
        return toTheme(themeBase16, `./themes/${normalizedThemeFileName}`);
    } catch (e) {
        return null;
    }
}

function getThemeQuickPickItem(themeName: string, picked: boolean): vscode.QuickPickItem | null {
    const theme = getTheme(themeName);
    if (!theme) {
        return null;
    } else {
        return {
            label: theme.label,
            description: themeName,
            picked,
        };
    }
}

export function getThemeItems(configuredThemes: string[]): vscode.QuickPickItem[] {
    const themeItems: vscode.QuickPickItem[] = [];

    for (const configuredTheme of configuredThemes) {
        const themeItem = getThemeQuickPickItem(configuredTheme, true);
        if (themeItem !== null) {
            themeItems.push(themeItem);
        }
    }

    for (const theme of THEMES) {
        // Filter picked themes
        if (configuredThemes.includes(theme)) {
            continue;
        }

        const themeItem = getThemeQuickPickItem(theme, false);
        if (themeItem !== null) {
            themeItems.push(themeItem);
        }
    }

    themeItems.sort((a, b) => a.description!.localeCompare(b.description!));
    return themeItems;
}

export function getThemeItemsToDisable(configuredThemes: string[]): vscode.QuickPickItem[] {
    const themeItems: vscode.QuickPickItem[] = [];

    for (const theme of configuredThemes) {
        const themeItem = getThemeQuickPickItem(theme, false);
        if (themeItem !== null) {
            themeItems.push(themeItem);
        }
    }

    return themeItems;
}

export function getAllThemeNames(): string[] {
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

/**
 * Write the given list of theme names to package.json in order to activate them.
 * 
 * @param themeNames The list of theme names to activate.
 * @returns The actual list of theme names activated. Theme names may be removed if given themes names were invalid.
 */
export function writeActivatedThemes(themeNames: string[] = []): string[] {
    const themes = themeNames.map(t => {
        const theme = getTheme(t);
        if (!theme) {
            return null;
        } else {
            return theme;
        }
    })
    .filter(t => t !== null)
    .sort((a, b) => a!.label.localeCompare(b!.label)) as Theme[];

    const packageContent = fs.readFileSync(PACKAGE_PATH, { encoding: 'utf8' });
    const edits = jsonc.modify(packageContent, ['contributes', 'themes'], themes, JSONC_MODIFICATION_OPTIONS);
    const packageContentModified = jsonc.applyEdits(packageContent, edits);

    fs.writeFileSync(PACKAGE_PATH, packageContentModified, {
        encoding: 'utf8',
    });

    return themes.map(t => getThemeNameFromTheme(t));
}

function getThemeNameFromTheme(t: Theme) {
    return getThemeNameFromThemePath(t.path);
}

function getThemeNameFromThemePath(path: string) {
    // Gets the filename of the relative theme path without .json
    // Group 2 is the filename of the theme without .json
    // https://regex101.com/r/d2Ld7K/1
    const themeNameRegex = /^(.\/themes\/)(.*?)(\.json)?$/;
    return path.replace(themeNameRegex, '$2');
}

export async function promptPickItems(themes: vscode.QuickPickItem[]): Promise<string[]> {
    const selectedThemes = await vscode.window.showQuickPick(themes, {
        ignoreFocusOut: false,
        matchOnDescription: false,
        matchOnDetail: false,
        placeHolder: 'Base16 Default Dark',
        canPickMany: true,
    });

    if (!selectedThemes) {
        return [];
    }

    return selectedThemes.map((item) => item.description!);
}

export function getValidThemeNames(themeNames: string[]): string[] {
    return themeNames.filter(t => getTheme(t) !== null);
}

export function arrayEquals(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}
