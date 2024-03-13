const { buildCategory, normalizeItem } = require('../../lib/skelo-utils');


describe('skelo-utils', () => {
    
    describe('category with generated index', () => {

        test('should return a category object with link property for generated index', () => {
            let options = {
                docs: "docs",
                sidebars: "sidebars"
            }

            let category = normalizeItem({
                label: 'Tutorial - Basics',
                generated_index: true,
                items: [ "Getting started" ]
            })

            expect(buildCategory(category, options)).toEqual({

                items: [ "getting-started" ],
                type: 'category',
                label: 'Tutorial - Basics',
                link: {
                    title: "Tutorial - Basics",
                    type: 'generated-index',
                },
            })
        })
    })

    describe('category with custom index', () => {

        test('should return a category object with link property for custom index', () => {
            let options = {
                docs: "docs",
                sidebars: "sidebars.js",
            }

            let category = normalizeItem({
                label: 'Tutorial - Basics',
                items: [ "Getting started" ],
                index: {
                    label: "Tutorial - Basics",
                    slug: "index",
                    headings: [ "Heading 1", "Heading 2" ]
                }
            })

            expect(buildCategory(category, options)).toEqual({
                items: [ "getting-started" ],
                type: 'category',
                label: 'Tutorial - Basics',
                link: {
                    id: "index",
                    type: 'doc',
                },
            })
        })
    })
})