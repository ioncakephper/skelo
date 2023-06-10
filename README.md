# skelo

Generate files for Docusaurus-based documentation from outline files (.yaml or .md)

## Installation

```bash
npm i -g skelo
```

## Check `skelo` availability

```bash
skelo -V
```

## Outline files

Specify outline files on the command line. By default, `skelo` looks for `skelo.outline.yml`.

## Options

`-s, --sidebar` `<filename>`

Sidebars structure filename to generate.

Default: `skelo.outline.yml`

`-d, --docs <path>`

Path to Docusaurus documents root folder. Files and folders are stored inside this folder.

Default: `docs`

`--outlineExtension <extension>`

Default extension to use for outline filenames.

Default: `.yml`

`--documentExtension <extension>`

Default extension to use for documentation files.

Default: `.md`

## Examples

```bash
skelo
```

- Use the default outline file (`skelo.outline.yml`). Generate documentation files in `./docs` folder, and generate sidebars structures in `./sidebars.js`

```bash
skelo skelo.outline
```

- Apply the default extension for outline files, which by default is `.yml`, and use the resulting filename: `skelo.outline.yml` -- similar to example above.
- Generate documentation files in `./docs` folder, and generate sidebars structures in `./sidebars.js`

```bash
skelo sample
```

- Apply the default extension for outline files, which by default is `.yml`, and use the resulting filename: `sample.yml`. Additionally, use the default outline file `skelo.outline.yml`.
- Generate documentation files in `./docs` folder, and generate sidebars structures in `./sidebars.js`.

```bash
skelo -s sidebarsUpdates.js -d updates
```

- Use the default outline filename `skelo.outline.yml`
- Generate documentation files in `./updates` folder, and generate sidebars structures in `.sidebarsUpdates.js`

## Outline files examples

### Basic outline file

An outline file contains sidebar label and sidebar items.

Create `skelo.outline.yml` as follows:

```yaml
sidebars:
    - docs:
        - Getting started
```

The `sidebars` property contains an array of sidebar elements with a single sidebar. The sidebar label is `docs`, and it contains one sidebar item: `Getting started`. This sidebar item indicates a document whose sidebar label is `Getting started` and id is `getting-started`.

The resulting `sidebars.js` file:

```js
const sidebars = {
    "docs": [
        "getting-started",
    ]
}
module.exports = sidebars;
```

The `docs/getting-started.md` file:

```md
---
sidebar_label: Getting started
---



# Getting started

```

### Sidebar with topics and categories

```yaml
sidebars:
   - docs:
        - Getting started
        - Examples:
             - First example
             - Second example
```

```js
module.exports = {

    "docs": [
    
         "getting-started",
         {
            type: "category",
            label: "Examples",
            items: [
                "first-example",
                "second-example"
            ]

          }
    ]
}
```


### Category and items

Edit `skelo.outline.yml` as follows:

```yaml
sidebars:
    - docs:
        - Getting started:
            - Overview
```

The `sidebars` property contains an array of sidebar elements with a single sidebar. The sidebar label is `docs`, and it contains one sidebar item: `Getting started`. This sidebar item indicates category whose sidebar label is `Getting started` and it contains a document. The document sidebar label is `Overview` and its id is `overview`.

The resulting `sidebars.js` file:

```js
const sidebars = {
    "docs": [
        {
            "type": "category",
            "label": Getting started",
            "items": [
                "overview"
            ]
        },
    ]
}
module.exports = sidebars;
```

The `docs/overview.md` file:

```md
---
sidebar_label: Overview
---

# Overview

```

### Document properties

The "Installation" document uses the the shorthand definition. The advantage of shorthand definition is that both label and title of the document are identical. However, you may want to have a document whose sidebar label is different from the title. For example, the label may read **Overview** while the title reads **Product documentation overview**.

To address this scenario, use the longhand definition.

Edit `skelo.outline.yml` as follows:

```yaml
sidebars:
    - docs:
        - Getting started:
            - Overview:
                title: Product documentation overview
```

The `sidebars` property contains an array of sidebar elements with a single sidebar. The sidebar label is `docs`, and it contains one sidebar item: `Getting started`. This sidebar item indicates category whose sidebar label is `Getting started` and it contains a document. The document sidebar label is `Overview`, its title is **Product documentation overview**, and its id is `overview`.

The `docs/overview.md` file:

```md
---
sidebar_label: Overview
---

# Product documentation overview

```

### Add headings

If you want to include headings into the document, use the longhand definition and include the `headings` property. The `headings` property accepts an array of either shorthand or longhand definitions. Each item in the array will appear as a heading on the document.

Edit `skelo.outline.yml` as follows:

```yaml
sidebars:
    - docs:
        - Getting started:
            - Overview:
                title: Product documentation overview
                headings:
                    - Installation
                    - Quick examples:
                        - Shorthand definition
                        - Longhand definition
```

The `docs/overview.md` file:

```md
---
sidebar_label: Overview
---

# Product documentation overview

## Installation

## Quick examples

### Shorthand definition

### Longhand definition

```

## Category properties

**`path`**

Sets the parent path of items in category. You can indicate several path level by separating each level with forward slash (/). Spaces are replaced by dash (-)

```yaml
    Getting started:
        path: Getting   Started / application
        items:
            - First item
```

Resulting sidebar code is:

```js
    {
        type: "category",
        label: "Getting started",
        items: [
            "getting-started/application/first-item"
        ]
    }
```

**`generated_index: true`**

Generate category index.

```yaml
    Getting started:
        generated_index: true
        items:
            - First item
```

The sidebar content is:

```js
    {
        type: "category",
        label: "Getting started",
        items: [
            "first-item"
        ],
        link: {
            type: "generated-index",
        }
    }
```

**`doc: true`**

Specify the page to show when clicking category title. 

::: note
Make sure you are generating the category page for the category that uses `doc` attribute. Docusaurus will fail to build the site when it can't find a referenced page, and will show an error message.
:::

Use the `slug` attribute to specify the filename to show when you click the category title.

```yaml
    "Getting started:
        doc: true
        slug: overview
        items:
            - First item
            - Second item
```

Results in:

```js
    {
        type: "category",
        label: "Getting started",
        link: {
            type: "doc",
            id: "overview"
        },
        items: [
            "first-item",
            "second-item"
        ]
    }
```

