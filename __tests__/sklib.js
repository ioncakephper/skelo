// const fs = require('fs')
const path = require('path')
const fileEasy = require('file-easy')
const yamljs = require('yamljs')



const skl = require('../lib/sklib')
// const { TestWatcher } = require('@jest/core')
const { hasUncaughtExceptionCaptureCallback } = require('process')

describe('sklib', () => {

    describe('.loadYamlOutline', () => {

        describe('when providing a yaml filename', () => {

            test('when outline file exists, return array of objects defined in sidebars', () => {

                let outline = {
                    sidebars: [
                        {
                            sidebar: "doc",
                            items: []
                        },
                    ]
                }
                let content = yamljs.stringify(outline, 256, 2);
                let yamlOutline = 'singleSidebarEmptyItems.yaml';
                fileEasy.saveDocument(yamlOutline, content);
                let sidebars = skl.loadYamlOutline(yamlOutline)
                expect(sidebars.length).toBe(1);
                expect(typeof sidebars[0]).toEqual('object');


                let sidebarKeysValid = Object.keys(sidebars[0]).every((k) => {
                    return ["sidebar", "items"].includes(k);
                })
                expect(sidebarKeysValid).toEqual(true)
            })
        })

    })

    describe('.convertMd2Yaml', () => {

        test('sidebar and items', () => {

        })

        test('several sidebars in the same outline file', () => {})

        test('simple item', () => {})

        test('simple item with attributes', () => {})

        test('simple item with a single heading', () => {})

        test('simple item with a single heading and brief', () => {})

        test('simple item with several headings at the same level', () => {})

        test('simple item with several headings at the same level with brief attribute', () => {})

        test('sidebar has attributes', () => {

            let content = `
## docs

- @path this is the path
- @slug this is the slug
- @summary true
- @overview {{slug}}
- @folder true
- Introduction
`
            let mdOutline = 'overviewWithSidebarAttributes.md';
            fileEasy.saveDocument(mdOutline, content);
            let sidebars = skl.convertMd2Yaml(mdOutline)
            let sb = sidebars[0];
            let sidebarAttrExist = Object.keys(sb).every((k) => {
                return "path slug summary overview folder sidebar items".split(' ').includes(k)
            })

            expect(sidebarAttrExist).toBe(true);
        })
    })

})
