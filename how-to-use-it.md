# How to use skelo

## Use the default outline file

```bash
skelo [options]
```

`skelo` will look for `skelo.outline.yml`

## Use several outline files

```bash
skelo my-first.outline my-second.outline [options]
```

`skelo` will look for `skelo.outline.yml`, `my-first.outline.yml`, and `my-second.outline.yml` outline files.

## Outline file with a single sidebar

```yaml
sidebars:
    - docs:
        items:
            - Topic 1
            - Topic 2
```

Provide sidebar definition for `docs` sidebar.

## Outline file with several sidebars

```yaml
sidebars:
    - docs:
        items:
            - Topic 1
            - Topic 2

    - tutorials:
        items:
            - Tutorial 1
            - Tutorial 2
```

## Sidebars for a specific instance

```yaml
instance: updates
sidebars:
    - docs:
        items:
            - Topic 1
            - Topic 2

    - tutorials:
        items:
            - Tutorial 1
            - Tutorial 2
```

For a multi-instance setting, sidebar definitions belong to `updates` instance. 