const fs = require('fs');
const yamljs = require('yamljs');


const {isValidOutlineFile} = require('../index');

describe("isValidOutlineFile function", () => {
    test("Valid outline file with non-empty array of sidebars", () => {
        const content = { sidebars: ["sidebar1", "sidebar2"] };
        fs.writeFileSync("valid_outline.yaml", yamljs.stringify(content));
        expect(isValidOutlineFile("valid_outline.yaml", { options: "some options" })).toBe(true);
        fs.unlinkSync("valid_outline.yaml");
    });

    test("Invalid outline file with no sidebars", () => {
        const content = { sidebars: null };
        fs.writeFileSync("invalid_outline.yaml", yamljs.stringify(content));
        expect(isValidOutlineFile("invalid_outline.yaml", { options: "some options" })).toBe(false);
        fs.unlinkSync("invalid_outline.yaml");
    });

    test("Invalid outline file with content not being an array", () => {
        const content = { sidebars: "not an array" };
        fs.writeFileSync("invalid_outline.yaml", yamljs.stringify(content));
        expect(isValidOutlineFile("invalid_outline.yaml", { options: "some options" })).toBe(false);
        fs.unlinkSync("invalid_outline.yaml");
    });

    test("Invalid outline file with empty array of sidebars", () => {
        const content = { sidebars: [] };
        fs.writeFileSync("empty_outline.yaml", yamljs.stringify(content));
        expect(isValidOutlineFile("empty_outline.yaml", { options: "some options" })).toBe(false);
        fs.unlinkSync("empty_outline.yaml");
    });
});