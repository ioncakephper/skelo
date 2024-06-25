const yamljs = require('yamljs')


// Organize exports of this module if needed


/**
 * Checks if the given YAML file contains a non-empty array of sidebars.
 *
 * @param {string} filename - The path to the YAML file.
 * @param {Object} options - Additional options for the function.
 * @return {boolean} Returns true if the YAML file contains a non-empty array of sidebars, false otherwise.
 * @throws {Error} Throws an error if the YAML file does not contain a non-empty array of sidebars.
 */
function isValidOutlineFile(filename, options) {

    try {
        let content = yamljs.load(filename);
        // console.log(JSON.stringify(content, null, 2));
        if (!content.sidebars || !Array.isArray(content.sidebars) || content.sidebars.length === 0) {
            throw new Error(`"${filename}" does not contain a non-empty array of sidebars`);
        }
        return true;
    } catch (err) {
        console.error(err.message);
        return false;
    }
    
}

/**
 * Normalizes an item by converting a string to an object with a label property,
 * checking if the item has a non-empty string label, and ensuring that the
 * items and headings properties are arrays.
 *
 * @param {string|object} item - The item to be normalized. If it is a string,
 * it is converted to an object with a label property.
 * @throws {Error} Throws an error if the item is an empty string, if the item
 * does not have a non-empty string label, or if the items or headings property
 * is not an array.
 * @return {object} The normalized item.
 */
function normalizeItem(item) {
    if (typeof item === 'string' && item.trim() === '') {
        throw new Error('Empty string is not a valid item');
    }
    if (typeof item === 'string') {
        return normalizeItem({label: item});
    }

    if (typeof item === 'object') {
        if (typeof item.label !== 'string' || item.label.trim() === '') {

            let label = Object.keys(item)[0];
            return normalizeItem({label, ...{items: item[label]}});
        }
        if (!item.items) {
            item.items = [];
        }
        if (item.items && !Array.isArray(item.items)) {
            throw new Error('Items must be an array');
        }
        if (item.items) {
            item.items = item.items.map(normalizeItem);
        }
        if (item.items.length === 0) {

            if (item.headings && !Array.isArray(item.headings)) {
                throw new Error('headings must be an array');
            }
            if (item.headings) {
                item.headings = item.headings.map(normalizeItem);
            }           
        }
    }

    return item;
}

/**
 * Convert a string to a slug.
 *
 * @param {string} input - The string to convert to a slug.
 * @throws {Error} Throws an error if the input is not a string.
 * @return {string} The slug.
 */
function slugify(input) {
    // Check if the input is a string
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }

    // Trim leading and trailing whitespace and convert to lowercase
    let slug = input.trim().toLowerCase();

    // Remove non-alphanumeric characters and replace with hyphens
    // Regular expression matches any character that is not a letter, number, space, or hyphen
    slug = slug.replace(/[^a-zA-Z0-9\s\-]/g, '-');

    // Remove multiple hyphens and reduce to a single hyphen
    // Regular expression matches one or more consecutive hyphens
    slug = slug.replace(/-+/g, '-');

    return slug;
}


module.exports = { isValidOutlineFile, normalizeItem, slugify };