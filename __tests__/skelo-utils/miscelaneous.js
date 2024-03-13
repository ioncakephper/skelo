const { isTopic, isLink, normalizeItem } = require('../../lib/skelo-utils')

describe('skelo-utils', () => {
    

    describe('isTopic', () => {
        test('should return true if the item is a topic', () => {
            let item = normalizeItem({
                items: []
            })
            expect(isTopic(item)).toBe(true);
        })
    })

    describe('isLink', () => {
        test('should return true if the item is a link', () => {

            let item = normalizeItem({
                label: 'Hello, World!',
                href: 'hello',
            })
            expect(isLink(item)).toBe(true);
        })
    })
})