module.exports = {
    "docs": [
        "overview",
        {
            "label": "Getting started",
            "type": "category",
            "items": [
                "installation",
                "outline-file"
            ]
        },
        {
            "label": "Tutorial",
            "type": "category",
            "items": [
                "basic-outline-file",
                "complex-outline-file",
                "build-documentation-quickly"
            ]
        }
    ],
    "demos": [
        {
            "label": "Demos",
            "type": "category",
            "items": [
                "demos/bootstrap-5",
                "demos/jest",
                "demos/react",
                {
                    "label": "Visual Studio Code",
                    "type": "category",
                    "items": [
                        {
                            "href": "/docs/demos/visual-studio-code/docs/overview",
                            "type": "link",
                            "label": "View Documentation"
                        }
                    ]
                }
            ],
            "link": {
                "type": "generated-index",
                "slug": "demos/overview"
            }
        }
    ],
    "visual-studio-code-docs": [
        {
            "label": "Visual Studio Code",
            "type": "category",
            "items": [
                {
                    "label": "Docs",
                    "type": "category",
                    "items": [
                        "demos/visual-studio-code/docs/overview",
                        {
                            "label": "Setup",
                            "type": "category",
                            "items": [
                                "demos/visual-studio-code/docs/setup/setup-overview",
                                "demos/visual-studio-code/docs/setup/linux",
                                "demos/visual-studio-code/docs/setup/maxos",
                                "demos/visual-studio-code/docs/setup/windows"
                            ]
                        }
                    ]
                },
                {
                    "label": "Updates",
                    "type": "category",
                    "items": [
                        "demos/visual-studio-code/updates/v1-73"
                    ]
                }
            ]
        }
    ]
}