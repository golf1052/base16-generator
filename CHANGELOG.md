# Change Log
All notable changes to the "base16-generator" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
