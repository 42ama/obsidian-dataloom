# Obsidian Notion-Like Tables

[![Active Development](https://img.shields.io/badge/Maintenance%20Level-Actively%20Developed-brightgreen.svg)](https://gist.github.com/cheerfulstoic/d107229326a01ff0f333a1d3476e068d)

Notion-Like Tables is your premiere tool for creating and managing tabular data in Obsidian.md.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/preview.png)

Lastest release notes:
[6.3.0](https://github.com/trey-wallis/obsidian-notion-like-tables/releases/tag/6.3.0)

## About

-   [Installation](#installation)
-   [Create a table](#create-a-table)
-   [Features](#features)
-   [Settings](#settings)
-   [Known Issues](#known-issues)
-   [CSS Styling](#css-styling)
-   [Bugs and Feature Requests](#bugs-and-feature-requests)
-   [License](#license)

## Installation

-   Open Obsidian Settings
-   Click `Community plugins`
-   Go to `Restricted mode` and click `Turn off` to allow community plugins
-   Click `Browse` and search for `Notion-Like Tables`
-   Click `Install` then `Enable`

## Create a Table

-   Click the table icon on the action bar

-   Or press `ctrl + p` (Windows) or `cmd + p` (Mac) on your keyboard and search `Create table`

## Plugin Features

-   Header menu - change the various settings for each column
-   Text cell - accepts any markdown. press shift + enter to create a new line
-   Number cell - accepts any number, including decimals
-   Currency cell - accepts a number and renders a currency value. Change the currency format in the header options menu
-   Date cell - accepts a date according to the date format specified. Change the date format in the header options menu
-   Tag cell - accepts text with no spaces and renders a single tag
-   Multi-tag cell - accepts text with no spaces and renders multiple tags
-   Checkbox cell - renders a checkbox
-   Creation time cell - renders the creation time of the row. Change the date format in the header options menu
-   Last edited time cell - renders the last edited time of the row. Change the date format in the header options menu
-   Tag color menu - allows you to select a color for each tag
-   Right click to copy - right click a cell to have the contents copied to your clipboard
-   Double click to resize column - resizes the column to the max size of the content
-   Search filter - filter by a specific search value
-   Sort by column - sort rows by ascending or descending values in a column
-   Toggle column filter - toggle visibility of table columns

## Settings

-   Create new tables in attachment folder
-   Custom location for new tables
-   Create table name based on active file name and timestamp

## Known Issues

### Markdown Support

Notion-Like Tables uses the Obsidian function `MarkdownRenderer.renderMarkdown` to render HTML element from markdown.
There are some known issues with this function where embedded elements, such as links not working properly. This part of the roadmap for future releases.

### Undoing Changes

There is currently no support for undoing changes. This is part of the roadmap for future releases.

## CSS Styling

Please override the following classes for custom theme development.

| Class                | Element  | Usage                  |
| -------------------- | -------- | ---------------------- |
| `.NLT__button`       | `button` |                        |
| `.NLT__table`        | `table`  |                        |
| `.NLT__tr`           | `tr`     |                        |
| `.NLT__th`           | `th`     | Border and text styles |
| `.NLT__th-content`   | `div`    | Padding                |
| `.NLT__td`           | `td`     | Border and text styles |
| `.NLT__td-container` | `div`    | Padding                |

## Bugs and Feature Requests

If you find a bug or would like to suggest a feature, please open an issue [here](https://github.com/trey-wallis/obsidian-notion-like-tables/issues).

## License

-   GNU GPLv3
