# Module Templates

A flexible VSCode extension for creating (and using) file/folder templates. If you're bored of typing the same boilerplate stuff every time you create a new thing, this might be for you.

**There are no templates included with this extension**.

![Screen capture](https://github.com/asbjornh/vscode-module-templates/raw/master/screencap.gif)

## Use

The plugin is used in one of two ways:

- Right click in the file explorer and select `New From Template`. The template files will be output here.

- Run `New From Template` using the command palette. Files will be output relative to the current workspace folder (and the `defaultPath` option if set)

## Templates

Templates are defined in VS Code settings. If your code is shared by many people it can be nice to put templates in workspace settings (`.vscode/settings.json`) so that they can be used by everyone!

Below is a config example, showing how a template for a React component can be defined. The example template defines a folder, a `.jsx` file and an `.scss` file.

```json
{
  "module-templates.engine": "handlebars",
  "module-templates.templates": [
    {
      "displayName": "React component",
      "defaultPath": "source/components",
      "folder": "{{kebab name}}",
      "questions": {
        "name": "Component name",
        "className": "HTML class name"
      },
      "files": [
        {
          "name": "{{kebab name}}.jsx",
          "content": [
            "import React from 'react';",
            "",
            "const {{pascal name}} = () =>",
            "  <div className=\"{{kebab className}}\" />",
            "",
            "export default {{pascal name}};"
          ]
        },
        {
          "name": "{{kebab name}}.scss",
          "content": [".{{kebab className}} {}"]
        }
      ]
    }
  ]
}
```

## Configuration API

### module-templates.engine

Optional. `"legacy" | "handlebars"`.

Use this to select what templating engine to use. For backward compatibility reasons `"legacy"` is currently the default, but the legacy engine might be deprecated and removed in the future. See below for details about the syntaxes for each engine.

### module-templates.templateFiles

Optional. `string[]`

A list of file paths to load templates from. The files must be `json` files and the contents must match the schema of the `module-templates.templates` option.

Paths can either be absolute, relative to the home directory (`~`) or relative to `.vscode/settings.json`. Relative paths will not work in user settings.

### module-templates.templates

An array of template objects. Templates have the following properties:

#### displayName

Optional. This name is used when selecting a template to create from. If this property is empty, the template will not be shown in the template selector (this can be useful if you create templates that are just for inheritance).

#### defaultPath

Optional. A path relative to the workspace root. When running the extension from the command palette files will be output to this path. When running from the right-click menu this option has no effect.

#### extends

Optional. List of template ids (string). When set, the template objects corresponding to the given ids are merged into the current template (overriding left to right, current template last). Questions are also merged, and files are concatenated. In short, you get all properties, files and questions from the inherited templates. See below for example.

#### folder

Optional. If this is option is set, a folder is created using the name from the option. This field is a template; you can use any syntax supported by the template engine.

#### files

Required. A list of file templates. File templates are objects with the following properties:

- `name`: Required. A name for the file to create (with file extension). Can also be a path (non-existing folders will be created). This field is a template; you can use any syntax supported by the template engine.
- `open`: Optional. A `boolean` that indicates whether this file should be opened after creation or not.
- `content`: Required. The template for the file to create, given as an array of strings.

#### id

Optional (string). Setting an `id` for a template lets you use that template in other templates. See `extends`.

#### questions

Optional. A dictionary of questions to ask when using the template. The answers are used as data when rendering the template. The aswers are referenced in templates by their key in the `questions` object.

Question values can be one of three types:

- `string`: The value is displayed as a label for the input box
- `object` with properties:
  - `displayName (string)`: Displayed as a label for the input box
  - `defaultValue (string)`: A value that is used if no text is input
- `array` of `object` (displayed as a selecttion menu). Properties:
  - `displayName (string)`: Displayed as the name of the option
  - `value (any value)`: The value to use when the value is selected

Note that the `legacy` engine only supports strings even if the `value` for array questions can be anything.

```json
{
  "questions": {
    "name": "File name",
    "myQuestion": "Some description",
    "myOtherQuestion": [
      { "displayName": "A", "value": [1, 2] },
      { "displayName": "B", "value": [3, 4] }
    ]
  },
  "folder": "{{name}}",
  "files": [
    {
      "name": "{{name}}.md",
      "content": [
        "{{myQuestion}}", // Outputs the answer from the prompt
        "{{#each myOtherQuestion}}",
        "{{this}}",
        "{{/each}}"
      ]
    }
  ]
}
```

## Composition / inheritance

Templates can be combined to create new ones. The `id` of a template can be referenced from other templates using `extends` (see `extends` option above for more technical details). When referencing a template `id` in `extends`, you inherit all properties, questions and files from that template. You can inherit multiple templates. Inheritance is recursive, so you can inherit other templates that inherit something else and so on.

By omitting `displayName` from templates, you can create hidden templates that are only used to create other templates. In the example below, only "React component with SCSS" will be available when selecting templates.

```json
{
  "module-templates.templates": [
    {
      "id": "jsx-file",
      "files": [
        {
          "name": "{name.kebab}.jsx",
          "content": [
            "const {name.pascal} = () => null;",
            "export default {name.pascal};"
          ]
        }
      ]
    },
    {
      "id": "scss-file",
      "files": [
        {
          "name": "{name.kebab}.scss",
          "content": [".{name.kebab} {}"]
        }
      ]
    },
    {
      "extends": ["jsx-file", "scss-file"],
      "defaultPath": "source/components",
      "displayName": "React component with SCSS",
      "folder": "{name.kebab}",
      "questions": { "name": "Component name" },
      "files": []
    }
  ]
}
```

## Legacy templates

The legacy template engine does one thing: it replaces patterns like `{something.kebab}` with the answer to the corresponding question (`something` in this case). The patterns must also include a casing variant (`kebab` in this case), which controls the formatting of the output text. Casing alternatives:

- `{<question-key>.raw}`: Unmodified text from input box
- `{<question-key>.pascal}`: PascalCased text
- `{<question-key>.kebab}`: kebab-cased text
- `{<question-key>.camel}`: camelCased text
- `{<question-key>.snake}`: snake_cased text

In the following example, a folder will be created using a kebab-case version of what was typed into the input box for the `componentName` question.

```json
{
  "module-templates.templates": [
    {
      "displayName": "React component",
      "folder": "{componentName.kebab}",
      "questions": {
        "componentName": "Component name"
      }
    }
  ]
}
```

## Handlebars templates

Enable Handlebars templates by setting `module-templates.engine` to `"handlebars"`. See the [Handlebars documentation](https://handlebarsjs.com/) for syntax. The answers object is passed directly to Handlebars as view data.

### Helpers

This plugin defines a few Handlebars helpers that you can use in templates. If you want more helpers, consider submitting a PR!

#### eq

Check whether thing A is equal to thing B. In the following example, `Yes!` will be output if the answer is `yes` and `No!` otherwise.

```json
[
  "{{#eq answer \"yes\"}}Yes!{{else}}No!{{/eq}}",
  "{{#if (eq answer \"yes\")}}Yes!{{else}}No!{{/if}}"
]
```

#### camel

Output text as `camelCase`

```json
"{{camel myAnswer}}"
```

#### kebab

Output text as `kebab-case`

```json
"{{kebab myAnswer}}"
```

#### snake

Output text as `snake_case`

```json
"{{snake myAnswer}}"
```

#### pascal

Output text as `PascalCase`

```json
"{{pascal myAnswer}}
```

## Migrating to V1

Versions of this plugin prior to `1.0.0` would always ask for a module name, and would therefore always support the `{name}` replacement token. In `1.0.0` the prompt for `{name}` was removed. This means that most templates created for older versions will not work anymore.

### How to make templates work again

To make broken templates work after upgrading to `1.0.0` add a `name` question to your templates, like so:

```json
{
  "module-templates.templates": [
    {
      "displayName": "React component",
      "folder": "{name.raw}",
      "questions": {
        "name": "Component name" // <- Add this
      },
      "files": [
        {
          "name": "{name.raw}.jsx",
          "content": []
        }
      ]
    }
  ]
}
```

If you're experiencing issues after adding a `name` question, please submit an issue.
