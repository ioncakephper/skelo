---
sidebar_label: Outline file schema
---

# Outline file schema

Outline file schema description


## Format

Format description


### String

A string item is a quick way of specifying an item with no items.

```yaml
# Specify two sidebars (docsSidebar and secondSidebar)
sidebars:
    - docsSidebar
    - secondSidebar
```

The explicit format equivalent is:

```yaml
sidebars:
    - label: docsSidebar
    - label: secondSidebar
```


### Quick format

A quick format specifies an item with several items.

```yaml
# Specify two sidebars (docsSidebar and secondSidebar)
sidebars:
    - docsSidebar:
        - First topic
        - Second topic
    - secondSidebar:
        - Topic in Second Sidebar
        - Category in Second Sidebar:
            - Topic in this category
            - Another topic in this category
```


The explicit format equivalent is:

```yaml
sidebars:
    - label: docsSidebar
      items:
        - label: First topic
        - label: Second topic

    - label: secondSidebar
      items:
        - label: Topic in Second Sidebar
        - label: Category in Second Sidebar
          items:
            - label: Topic in this category
            - label: Another topic in this category
```

### Explicit format





## Sidebar




## Topic




## Category



