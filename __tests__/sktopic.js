const fs = require('fs')
const path = require('path')
const fileEasy = require('file-easy')



const skt = require('../lib/sktopic')

describe('sktopic', () => {

    describe(`.buildTopicFile()`, () => {

        describe(`given a valid topicFilename, an item, and options`, () => {

            test('topic file has no sidebar_label when no title provided', () => {
                let commander = {};
                let options = {docs: './docs'};
                let item = skt.create({label: 'Just label, no title'})
                let tfn = skt.getItemSlug(item);
                skt.buildTopicFile(tfn, item, options, commander)

                let rv = fs.existsSync(path.join(options.docs, fileEasy.setDefaultExtension(tfn, '.md')))
                expect(rv).toEqual(true)

            })

            test('topic file has sidebar_label when title provided. sidebar_label is the label', () => {
                let commander = {};
                let options = {docs: './docs'};
                let item = skt.create({label: 'Has label and Title'})
                item.title = 'Here is the title';
                let tfn = skt.getItemSlug(item);
                skt.buildTopicFile(tfn, item, options, commander)

                let rv = fs.existsSync(path.join(options.docs, fileEasy.setDefaultExtension(tfn, '.md')))
                expect(rv).toEqual(true)

            })

            test('topic file front end has no id when item has no slug', () => {

                let commander = {};
                let options = {docs: './docs'};
                let item = skt.create({})
                let tfn = skt.getItemSlug(item);
                skt.buildTopicFile(tfn, item, options, commander)

                let rv = fs.existsSync(path.join(options.docs, fileEasy.setDefaultExtension(tfn, '.md')))
                expect(rv).toEqual(true)
            })

            test('topic file front end has no id when item has slug identical to slug based on label', () => {


                let commander = {};
                let options = {docs: './docs'};
                let item = skt.create({label: 'Some label', slug: '   some-label   '})
                let tfn = skt.getItemSlug(item);
                skt.buildTopicFile(tfn, item, options, commander)

                let rv = fs.existsSync(path.join(options.docs, fileEasy.setDefaultExtension(tfn, '.md')))
                expect(rv).toEqual(true)
            })


            test('topic file front end has id when item has slug different to slug based on label', () => {

                let commander = {};
                let options = {docs: './docs'};
                let item = skt.create({label: 'Some other label', slug: '   different-label   '})
                let tfn = skt.getItemSlug(item);
                skt.buildTopicFile(tfn, item, options, commander)

                let rv = fs.existsSync(path.join(options.docs, fileEasy.setDefaultExtension(tfn, '.md')))
                expect(rv).toEqual(true)
            })
            
        })      
    }),

    describe('.create()', () => {

        describe('given a string', () => {

            test('that is empty, return an object with default label', () => {
                let t = skt.create('')
                expect(t).toStrictEqual({label: 'No label'})
            })

            test('that has characters, return an object with a trimmed label', () => {
                let t = skt.create(' A  new  Label  ')
                expect(t).toStrictEqual({label: 'A  new  Label'})
            })
        })

        describe('given an object', () => {
            test('that has no label, return an object with default label', () => {
                let t = skt.create({});
                expect(t).toStrictEqual({label: 'No label'})
            })

            test('that has a label, return an object with object"s trimmed label', () => {        
                let t = skt.create({label: '  Trimmed label   '});
                expect(t).toStrictEqual({label: 'Trimmed label'})
            })

            test('that has an empty label attribute, return object with default label', () => {
                let t = skt.create({label: '     '})
                expect(t).toStrictEqual({label: 'No label'})
            })
        })
    })


    describe('.getItemLabel()', () => {

        describe('given a string', () => {

            test(`that is emtpy, return the default label`, () => {
                let l = skt.getItemLabel('');
                expect(l).toStrictEqual('No label')
            })

            test('that has characters, return the trimmed label', () => {
                let l = skt.getItemLabel('   Custom label   ');
                expect(l).toStrictEqual('Custom label')
            })
        })

        describe('given an object', () => {

            test(`that is emtpy, return the default label`, () => {
                let t = skt.create('')
                let l = skt.getItemLabel(t);
                expect(l).toStrictEqual('No label')
            })

            test('that has label attribute, return the trimmed label', () => {
                let t = skt.create('   Custom label   ')
                let l = skt.getItemLabel(t);
                expect(l).toStrictEqual('Custom label')
            })

            test('that has no label attribute, return the default label', () => {
                let t = {}
                let l = skt.getItemLabel(t);
                expect(l).toStrictEqual('No label')
            })

            test('that has label an empty attribute, return the default label', () => {
                let t = {label: '        '}
                let l = skt.getItemLabel(t);
                expect(l).toStrictEqual('No label')
            })

        })
    })

    describe(`getItemSlug()`, () => {

        describe('given a string', () => {

        })

        describe('given an object', () => {

            test('that is empty, return default slug', () => {

                let s = skt.getItemSlug({})
                expect(s).toStrictEqual('no-label')
            })

            test('that has empty label, return default slug', () => {
                let s = skt.getItemSlug({label: '   '})
                expect(s).toStrictEqual('no-label')
            })

            test('that has label but no slug, return slug based on label', () => {
                let s = skt.getItemSlug({label: ' Custom label  '})
                expect(s).toStrictEqual('custom-label')
            })

            test('that has both label and slug, return slug based on slug', () => {
                let s = skt.getItemSlug({label: ' Custom label  ', slug: '  Custom Slug '})
                expect(s).toStrictEqual('custom-slug')
            })

            test('that has both label and slug but slug is empty, return slug based on label', () => {
                let s = skt.getItemSlug({label: ' Custom label  ', slug: '   '})
                expect(s).toStrictEqual('custom-label')
            })           
        })
    })

    describe(`.getItemTitle()`, () => {

        describe('given a string', () => {
            
            test('that is empty, return default label', () => {
                let title = skt.getItemTitle('   ')
                expect(title).toStrictEqual('No label')
            })

            test('that has characters, return label', () => {
                let title = skt.getItemTitle('  Custom label ')
                expect(title).toStrictEqual('Custom label')
            })
        })

        describe('given an object', () => {

            test('that is empty, return default label', () => {
                let title = skt.getItemTitle({})
                expect(title).toStrictEqual('No label')
            })



            test('that has label but no title, return the label', () => {
                let title = skt.getItemTitle({label: '  Custom label '})
                expect(title).toStrictEqual('Custom label')
            })


            test('that has both label and title, return trimmed title', () => {
                let title = skt.getItemTitle({label: '  Custome label ', title: '  Custom title  '})
                expect(title).toStrictEqual('Custom title')
            })


            test('that has both label and title but title is empty, return label', () => {
                let title = skt.getItemTitle({label: '  Custom label ', title: '    '})
                expect(title).toStrictEqual('Custom label')
            })
        })
    })

    describe(`.getItemPath()`, () => {

        describe('given an object', () => {

            test('that has no slug, return undefined', () => {

                let t = skt.create('')
                let p = skt.getItemPath(t)
                expect(typeof p).toStrictEqual('undefined')
            })


            
            test('that has empty slug, return undefined', () => {

                let t = skt.create('').path = '   '
                let p = skt.getItemPath(t)
                expect(typeof p).toStrictEqual('undefined')
            })

                        
            test('that has slug a single level, return slug of level', () => {
                let t = skt.create('')
                t.path = ' path to item   '
                let p = skt.getItemPath(t)
                expect(p).toStrictEqual('path-to-item')
            })

            test('that has slug with multiple levels separated by /, return slug of multiple levels joined by slash', () => {
                let t = skt.create('')
                t.path = ' path to parent / path to item   '
                let p = skt.getItemPath(t)
                expect(p).toStrictEqual('path-to-parent/path-to-item')
            })

            test('that has slug with multiple levels separated by / with empty levels within, return slug of multiple levels joined by slash', () => {
                let t = skt.create('')
                t.path = ' path to parent / / path to item   '
                let p = skt.getItemPath(t)
                expect(p).toStrictEqual('path-to-parent//path-to-item')
            })       

        })
    })

})