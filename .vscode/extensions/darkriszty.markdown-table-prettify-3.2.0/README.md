# Markdown table prettifier extension for Visual Studio Code

[![Test Status](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/workflows/Tests/badge.svg)](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/actions)

Makes tables more readable for humans. Compatible with the Markdown writer plugin's table formatter feature in Atom.

## Features

- Remove redundant ending table border if the beginning has no border, so the table _will not end_ with "|".
- Create missing ending table border if the beginning already has a border, so the table _will end_ with "|".
- Save space by not right-padding the last column if the table has no border.
- Support empty columns inside tables.
- Support column alignment options with ":".
- CLI and docker support to prettify files.

![feature X](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/raw/master/assets/animation.gif)

### CLI formatting

Formatting files or checking if they're already formatted is possible from the command line. This requires `node` and `npm`.

The extension has to be downloaded and compiled:
- Locate the installed extension path or download the extension from Github.
- Go to the extension directory.
- Run `npm install`.
- Run `npm run compile`.

The typical location of the installed extension (your actual version might differ):
- Windows: `%USERPROFILE%\.vscode\extensions\darkriszty.markdown-table-prettify-3.0.0`
- macOS: `~/.vscode/extensions/darkriszty.markdown-table-prettify-3.0.0`
- Linux: `~/.vscode/extensions/darkriszty.markdown-table-prettify-3.0.0`

Available features from the command line:
- To prettify a file: `npm run --silent prettify-md < input.md`.
- To prettify a file and save the output: `npm run --silent prettify-md < input.md > output.md`.
- To check whether a file is prettyfied or not: `npm run --silent check-md < input.md`. This will fail with an exception and return code `1` if the file is not prettyfied.

> Note: the `--silent` switch sets the npm log level to silent, which is useful to hide the executed file name and concentrate on the actual output.

### Formatting with docker

The core formatting logic of the extension is also available as a node docker image: `docker pull darkriszty/prettify-md`.

Available features from docker:
- To prettify a file: `docker container run -i darkriszty/prettify-md < input.md`.
- To prettify a file and save the output: `docker container run -i darkriszty/prettify-md < input.md > output.md`.
- To check whether a file is prettyfied or not: `docker container run -i darkriszty/prettify-md --check < input.md`. This will fail with an exception and return code `1` if the file is not prettyfied.

## Extension Settings

The extension is available for markdown language mode. It can either prettify a selection (`Format Selection`) or the entire document (`Format Document`).
A VSCode command called `Prettify markdown tables` is also available to format the currently opened document. 

Configurable settings:
- The maximum texth length of a selection/entire document to consider for formatting. Defaults to 1M chars. There is no limit when running from the command line.
- Keyboard shortcut to prettify the currently opened markdown document. Default: CTRL+ALT+M (CMD+ALT+M on Mac).

## Known Issues

- Tables with mixed character widths (eg: CJK) are not always properly formatted (issue [#4](https://github.com/darkriszty/MarkdownTablePrettify-VSCodeExt/issues/4)).