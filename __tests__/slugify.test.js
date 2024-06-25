
const { slugify } = require('../index'); // Import your slugify function

describe('slugify', () => {
    test('should throw an error if input is not a string', () => {
        expect(() => slugify(123)).toThrow('Input must be a string');
    });


    test('should convert input to lowercase', () => {
        expect(slugify('Hello World')).toBe('hello world');
    });

    test('should remove non-alphanumeric characters and replace with hyphens', () => {
        expect(slugify('Hello!@#$World123')).toBe('hello-world123');
    });

    test('should reduce multiple hyphens to a single hyphen', () => {
        expect(slugify('Hello---World')).toBe('hello-world');
    });
});