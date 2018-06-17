# Change Log
All notable changes to the "base16-generator" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
