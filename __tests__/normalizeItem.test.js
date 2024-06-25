const { normalizeItem } = require('../index');

describe('normalizeItem', () => {
    test('should throw an error if item is an empty string', () => {
      expect(() => normalizeItem('')).toThrow('Empty string is not a valid item');
    });
  
    test('should convert a string item to an object with a label property', () => {
      const item = 'Test Item';
      expect(normalizeItem(item)).toEqual({ label: 'Test Item', items: []});
    });
  
    test('should throw an error if item does not have a non-empty string label', () => {
      const item = { label: '' };
      expect(() => normalizeItem(item)).toThrow('Item must have a non-empty string label');
    });
  
    test('should throw an error if items property is not an array', () => {
      const item = { label: 'Test Item', items: 'Not an array' };
      expect(() => normalizeItem(item)).toThrow('Items must be an array');
    });
  
    test('should throw an error if headings property is not an array', () => {
      const item = { label: 'Test Item', headings: 'Not an array' };
      expect(() => normalizeItem(item)).toThrow('headings must be an array');
    });
  
    test('should recursively normalize nested items and headings', () => {
      const item = {
        label: 'Test Item',
        items: [
          'Nested Item 1',
          {
            label: 'Nested Item 2',
            headings: [
                'Nested Heading 1',
                {
                  label: 'Nested Heading 2',
                  items: ['Nested Heading 3'],
                },
              ]
          },
        ],
      };
      const expected = {
        label: 'Test Item',
        items: [
          { label: 'Nested Item 1', items: [] },
          {
            label: 'Nested Item 2',
            items: [],
            headings: [
              { label: 'Nested Heading 1', items: [] },
              { label: 'Nested Heading 2', items: [{ label: 'Nested Heading 3', items: [] }] },
            ]
          },
        ],
      };
      expect(normalizeItem(item)).toEqual(expected);
    });
  });