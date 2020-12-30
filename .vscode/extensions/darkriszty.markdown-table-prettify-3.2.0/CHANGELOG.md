# Change Log

All notable changes to the `markdowntableprettify` extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## 3.2.0 - 2020-12-14
### Added
- Issue [#47](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/47): Support for indented tables.

## 3.1.0 - 2020-11-04
### Fixed
- Issue [#42](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/42): Don't alter selection for invalid range formatting attempt (does not impact CLI).
- Issue [#43](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/43): Handle `Format Selection` with multiple tables (does not impact CLI).

## 3.0.0 - 2020-10-06
### Added
- Issue [#32](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/32): Major refactoring to support CLI. Support `npm run prettify-md` and `npm run check-md`.
- Issue [#40](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/40): Provide command to run alongside prettier (shortcut `CTRL+ALT+M`).

## 2.5.0 - 2020-07-04
### Added
- Issue [#30](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/30): Add configurable text limit for table formatting

## 2.4.0 - 2019-05-11
### Added
- Issue [#28](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/28): Add the possibility to disable window messages from the extension

## 2.3.0 - 2018-12-16
### Added
- Issue [#7](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/7): Support formatting all tables in the document.

## 2.2.0 - 2018-09-26
### Added
- Issue [#22](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/22): Allow formatting without a filename

## 2.1.0 - 2018-09-15
### Added
- Issue [#15](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/15): Support alignment options

## 2.0.0 - 2018-02-09
### Added
- Issue [#12](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/12): Full rewrite for refactoring.
- Issue [#11](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/11): Support escaping of separators with backslash.
- Issue [#16](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/16): Ignore separators that are in code blocks.

## 1.1.1 - 2017-05-27
### Fixed
- Issue [#10](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/10): Don't show format failure messages when using the `Format Document` from VsCode.

## 1.1.0 - 2017-05-09
### Added
- Issue [#6](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/6): Formatting when there's only a single table in the entire file.
- Issue [#4](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/4): Add support for CJK characters.

## 1.0.1 - 2017-04-08
### Fixed
- Fixed issue [#1](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/1) by improving the detection of header separator to avoid unintended table formatting failures.

## 1.0.0 - 2017-04-03
### Added
- Support to format individual tables with right click -> `Format Selection`.
