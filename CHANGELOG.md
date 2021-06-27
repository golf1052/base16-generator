# Change Log
All notable changes to the "base16-generator" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.15.0] - 2021-06-27
## Added
- Added support for [Workspace Trust](https://code.visualstudio.com/docs/editor/workspace-trust) and [Virtual Workspaces](https://code.visualstudio.com/updates/v1_56#_define-whether-your-extension-supports-a-virtual-workspace).
- Added themes
  - Apprentice Dark
  - Apprentice Light
  - Colors Dark
  - Colors Light
  - DanQing Dark
  - DanQing Light
  - Darcula Dark
  - Darcula Light
  - pinky Dark
  - pinky Light
  - Qualia
  - Rosé Pine Dark
  - Rosé Pine Dawn Dark
  - Rosé Pine Dawn Light
  - Rosé Pine Light
  - Rosé Pine Moon Dark
  - Rosé Pine Moon Light
  - Sakura Dark
  - Sakura Light
  - Shades of Purple Dark
  - Shades of Purple Light
  - tender Dark
  - tender Light
  - Windows 10 Dark
  - Windows 10 Light
  - Windows 95 Dark
  - Windows 95 Light
  - Windows High Contrast Dark
  - Windows High Contrast Light
  - Windows NT Dark
  - Windows NT Light

## [1.14.0] - 2020-12-30
## Added
- A bunch of missing colors that were added to VSCode over the past year.
- Added themes
  - Kimber Dark
  - Kimber Light
  - Sagelight Dark
  - Sagelight Light
  - Silk Dark
  - Silk Light

## [1.13.1] - 2020-10-09
## Fixed
- Upgraded dependencies

## [1.13.0] - 2020-07-15
## Added
- Added command to activate all themes (see https://github.com/golf1052/base16-generator/issues/16)
- Added command to deactivate all themes
- Added themes
  - Eva Dim Dark
  - Eva Dim Light
  - Nebula Dark
  - Nebula Light
  - Pasque Dark
  - Pasque Light

## Changed
- Command to activate a theme can now activate multiple themes at once
- Command to deactivate a theme can now deactivate multiple themes at once
- **Breaking**: In order to support the above two changes a minimum version of VSCode 1.22 is now required.
- Changed themes
  - Synth Midnight Dark is now named Synth Midnight Terminal Dark
  - Synth Midnight Light is now named Synth Midnight Terminal Light

## [1.12.1] - 2020-05-10
## Added
- Added themes
  - darkmoss Dark
  - darkmoss Light
  - Dark Violet Dark
  - Dark Violet Light
  - dirtysea
  - Equilibrium Dark
  - Equilibrium Gray Dark
  - Equilibrium Gray Light
  - Equilibrium Light
  - eva Dark  
  - eva Light
  - Humanoid dark
  - Humanoid light
  - summercamp Dark
  - summercamp Light
  - Tango Dark
  - Tango Light
  - vulcan

## Fixed
- Fixed bug where double reload was needed when changing themes.

## [1.12.0] - 2020-01-21
## Added
- [Debug icon color tokens](https://code.visualstudio.com/updates/v1_41#_debug-icon-color-tokens) from 1.41
- Added themes
  - Hardcore Dark
  - Hardcore Light

## Fixed
- A few `symbolIcon` themes
- `list.warningForeground` is now yellow instead of orange

## [1.11.0] - 2019-11-19
## Fixed
- Fixed terminal colors. (see https://github.com/golf1052/base16-vscode/pull/1, thanks @aaron-williamson)
- Various fixes (see https://github.com/golf1052/base16-vscode/pull/2, thanks @reyemxela)
- Fixed `symbolIcon.snippetForeground`

## [1.10.0] - 2019-11-16
## Added
- A bunch of color customizations up to version 1.40
- Added themes
  - Edge Dark
  - Edge Light
  - Gigavolt Dark
  - Gigavolt Light

## [1.9.0] - 2019-07-28
## Added
- Added command to deactivate the activated Base16 theme. (see https://github.com/golf1052/base16-generator/issues/11)
- Added themes
  - Atlas Dark
  - Atlas Light
  - Decaf Dark
  - Decaf Light
  - Espresso Dark
  - Espresso Light
  - Framer Dark
  - Framer Light
  - Heetch Dark
  - Heetch Light
  - Helios Dark
  - Helios Light
  - Horizon Dark
  - Horizon Light
  - Nova
  - Sandcastle Dark
  - Sandcastle Light
  - Synth Midnight Dark
  - Synth Midnight Light
  - Tomorrow Night Dark
  - Tomorrow Night Light

## [1.8.0] - 2018-09-12
## Added
- Added themes
  - Fruit Soda Dark
  - Fruit Soda Light
  - iA Dark
  - iA Light
  - PaperColor Dark
  - PaperColor Light
- Added `breadcrumb.background` and `settings.modifiedItemIndicator` from 1.27

## [1.7.0] - 2018-08-25
## Added
- Added settings editor preview and breadcrumbs theming from 1.26

## [1.6.1] - 2018-08-11
## Changed
- Improved visibility of text selection highlight color (see https://github.com/golf1052/base16-generator/issues/10)

## [1.6.0] - 2018-06-15
## Added
- Added themes
  - Black Metal (Bathory) Dark  
  - Black Metal (Bathory) Light  
  - Black Metal (Burzum) Dark  
  - Black Metal (Burzum) Light  
  - Black Metal (Dark Funeral)  
  - Black Metal Dark  
  - Black Metal (Dark Funeral) Light  
  - Black Metal (Gorgoroth) Dark  
  - Black Metal (Gorgoroth) Light  
  - Black Metal (Immortal) Dark  
  - Black Metal (Immortal) Light  
  - Black Metal (Khold) Dark  
  - Black Metal (Khold) Light  
  - Black Metal Light  
  - Black Metal (Marduk) Dark  
  - Black Metal (Marduk) Light  
  - Black Metal (Mayhem) Dark  
  - Black Metal (Mayhem) Light  
  - Black Metal (Nile) Dark  
  - Black Metal (Nile) Light  
  - Black Metal (Venom) Dark  
  - Black Metal (Venom) Light  
  - Brogrammer Dark  
  - Brogrammer Light  
  - Material Vivid Dark  
  - Material Vivid Light  
  - Outrun Dark  
  - Outrun Light  
  - Snazzy Dark  
  - Snazzy Light  
- Added `editorIndentGuide.activeBackground` from 1.23
- Added `list.errorForeground` and `list.warningForeground` from 1.24

## [1.5.0] - 2018-03-09
## Added
- Added themes
  - Icy Dark
- Added support for new notification style that was introduced in 1.21.

## Fixed
- Fixed coloring of find selected highlight background

## [1.4.0] - 2017-11-25
## Added
- Added themes
  - Porple Dark
  - Porple Light
- Added support for new workbench theme elements that were introduced in 1.18

## Changed
- Changed syntax highlighting in the following languages to conform more to the [base16 styling guidelines](https://github.com/chriskempson/base16/blob/master/styling.md)
  - C#
  - Java
  - Typescript
- build-themes.js now copies over the default.mustache file to the vscode templates directory when the themes are being built. Now you don't have to commit the updated template file to the [base16-vscode](https://github.com/golf1052/base16-vscode) first.

## Fixed
- Repeated characters in Markdown file (see https://github.com/golf1052/base16-generator/issues/8)
- Suggest widget highlighting (Intellisense)
- Contributing instructions

## [1.3.0] - 2017-10-07
## Added
- Added themes
  - XCode Dusk Dark
  - XCode Dusk Light

## Fixed
- Modified the script that finishes the JSON theme files to now check if the background color is light or dark instead of just relying on the filename. If a theme didn't have light or dark in the filename then it could be themed incorrectly. The following themes were fixed by this change.
  - Github

## [1.2.0] - 2017-09-23
## Added
- Added themes
  - Brush Trees Dark
  - Brush Trees Light
  - Gruvbox dark, pale Light
  - Mellow Purple Dark
  - Mellow Purple Light
  - Mexico Dark
  - One Dark

## Changed
- The following themes should not have been made into a dark or light counterpart so they are just one theme now
  - Github
  - Rebecca

## Removed
- Visual Studio Blue Dark
- Visual Studio Blue Light

## Fixed
- Updated and fixed the generate theme scripts as well as automated the process.
- The following themes were fixed because of this (this change was prompted by https://github.com/golf1052/base16-generator/issues/3)
  - Cupcake Dark is now correctly dark
  - Cupcake Light is now correctly light
  - Cupertino Dark is now correctly dark
  - Cupertino Light is now correctly light
  - Shapeshifter Dark is now correctly dark
  - Shapeshifter Light is now correctly light
  - Tomorrow Dark is now correctly dark
  - Tomorrow Light is now correctly light

## [1.1.1] - 2017-09-06
### Fixed
- Marked Base16 Twilight Dark as a "dark" theme, it was incorrectly marked as "light". (see https://github.com/golf1052/base16-generator/issues/2)

## [1.1.0] - 2017-07-29
### Added
- Added themes
  - Material Darker
  - Material Ligher
  - Material Palenight Dark
  - Material Palenight Light

### Changed
- Fixed coloring of `if` in python (see https://github.com/golf1052/base16-generator/issues/1)

## [1.0.0] - 2017-07-15
- Initial release
