const { normalizeItem } = require('../../lib/skelo-utils')

describe('skelo-utils', () => {
    
    describe('normalizeItem', () => {
        
        test('should return a normalized item from a string', () => {
            let item = 'Hello, World!'
            expect(normalizeItem(item)).toEqual({ label: "Hello, World!", items: [] })
        })

        test('should return a normalized item from an object with label property', () => {
            let item = { label: 'Hello, World!' }
            expect(normalizeItem(item)).toEqual({ label: "Hello, World!", items: [] })
        })

        test('should return a normalized item from an object with a string property', () => {
            let item = { "Category": ["Hello, World!"] }
            expect(normalizeItem(item)).toEqual({ label: "Category", items: [
                { label: "Hello, World!", items: [] }
            ] })
        })

        test('should return a normalized item from an object that includes all prroperties of the original item and the items property', () => {

            let original = {
                label: 'Hello, World!',
                generated_index: true,
                path: 'hello'
            }
            let item = normalizeItem(original);
            expect(Object.keys(original).every(key => key in item) && Object.keys(item).includes('items')).toBe(true);
        })
    })
})