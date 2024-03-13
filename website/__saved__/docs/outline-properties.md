---
sidebar_label: Outline Properties
---

# Outline Properties

## Outline item formats

### String

### Standard item

### Quick item

**Use when:** you want to quickly create an outline that captures ideas and categories in each sidebar.

The quick item format uses an object with a single property whose value is an array of items. For example:

```yaml
sidebars:
   - Quick item label:
        - First item as string
        - label: Second item as standard
        - Third item as quick format:
            - First item
```

The `sidebars` property comprises an array with a single sidebar. The `Quick item label` property is converted into the `label` value of a standard item while the three items of the associated array are converted into the `items` for 'Quick item label'

The equivalent explicit specification reads:

```yaml
sidebars:
    - label: Quick item label
      items:
        - label: First item as string
        - label: Second item as standard
        - label: Third item as quick format
          items:
            - label: First item
```
