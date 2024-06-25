#!/usr/bin/env node

const Commander = require("commander");
const {globSync} = require("glob");
const path = require("path");
const yamljs = require("yamljs");
const fs = require("fs");
const Handlebars = require("handlebars");

const {isValidOutlineFile, normalizeItem, slugify} = require('../index');

const program = new Commander.Command();

let {version = "1.0.0", name = "skelo", description = "Build sidebars and topic files for Docusaurus-powered sites."} = require("../package.json");
program
    .version(version)
    .description(description)
    .name(name)
    
program
    .command("build [args...]", {isDefault: true})
    .description("Build sidebars and topic files for Docusaurus-powered sites.")
    .option("-d, --docs <path>", "Path to your Docusaurus docs folder.", "docs")
    .option('-s, --sidebarsName <name>', 'Name of your sidebars file.', 'sidebars')
    .option('--sidebarsExtension <extension>', 'Extension of your sidebars file.', 'js')
    .option('--templatesPath <path>', 'Path to your Docusaurus templates folder.', 'templates')
    .option('--templatesExtension <extension>', 'Extension of your templates file.', 'hbs')
    .option('--topicExtension <extension>', 'Extension of your topic file.', 'md')
    .action((args, options) => {
        console.log("Building sidebars and topic files for Docusaurus-powered sites.");
        // console.log(JSON.stringify(options, null, 2));
        // console.log(JSON.stringify(args, null, 2));

        let outlineFiles = getOutlineFiles(args, options);
        // console.log(JSON.stringify(outlineFiles, null, 2));

        documentSidebars = {};

        outlineFiles.forEach((outlineFile) => {

            let content = yamljs.load(outlineFile);
            content.sidebars.forEach((sidebarDefinition) => {
                // console.log(JSON.stringify(sidebarDefinition, null, 2));
                sidebarDefinition = normalizeItem(sidebarDefinition);
                let {sidebarLabel, sidebarItems} = {
                    
                        sidebarLabel: sidebarDefinition.slug || slugify(sidebarDefinition.label),
                        sidebarItems: buildItems(sidebarDefinition.items, options)
                    
                };

                documentSidebars[sidebarLabel] = sidebarItems;
            })
        });

        // generate sidebars files
        let sidebarsFilename = `${options.sidebarsName}.${options.sidebarsExtension}`
        let sidebarsContent = renderTemplateFile('sidebars', {sidebars: JSON.stringify(documentSidebars, null, 2)}, options);

        fs.writeFileSync(sidebarsFilename, sidebarsContent, 'utf8');
    });

program.parse(process.argv);
// program.parse("node bin/cli.js build --docs docs --sidebarsName sidebars --sidebarsExtension js --templatesPath templates".split(" "))


/**
 * Renders a Handlebars template string with the provided data and returns the result.
 *
 * @param {string} templateString - The Handlebars template string to render.
 * @param {Object} data - The data to be used for rendering the template string.
 * @throws {Error} Throws an error if the template string or data is missing.
 * @return {string} The rendered result of the Handlebars template string.
 */
function render(templateString, data) {
    // Check if both templateString and data are provided
    if (!templateString || !data) {
        throw new Error('Template string and data are required');
    }

    // Compile the template string with data and return the result
    return Handlebars.compile(templateString)(data);
}

/**
 * Renders a Handlebars template file with the provided data and returns the result.
 *
 * @param {string} templateFilename - The filename of the Handlebars template file to render.
 * @param {Object} data - The data to be used for rendering the template file.
 * @param {Object} options - Additional options for rendering the template file.
 * @param {string} options.templatesPath - The path to the templates folder.
 * @param {string} options.templateExtension - The extension of the template file.
 * @throws {Error} Throws an error if any of the required parameters are missing or if the template file does not exist.
 * @return {string} The rendered result of the Handlebars template file.
 */
function renderTemplateFile(templateFilename, data, options) {
    // Check if all required parameters are provided
    if (!templateFilename || !data || !options || !options.templatesPath || !options.templatesExtension) {
        throw new Error('Template filename, data, options, templatesPath, and templatesExtension are required');
    }

    // Add the template extension if it is not already present
    templateFilename = path.extname(templateFilename) === '' ? `${templateFilename}.${options.templatesExtension}` : templateFilename;
    // Join the templatesPath with the templateFilename to get the full path to the template file
    templateFilename = path.join(options.templatesPath, templateFilename);

    try {
        // Read the template file and render it with the provided data
        return render(fs.readFileSync(templateFilename, 'utf8'), data);
    } catch (err) {
        // If the template file does not exist, throw an error
        if (err.code === 'ENOENT') {
            throw new Error(`Template file ${templateFilename} does not exist`);
        } else {
            // Otherwise, throw the original error
            throw err;
        }
    }
}

function createTopic(item, options) {

    let basename = slugify(item.slug || item.label);
    basename = path.join(slugify(item.path || ''), basename);

    try {
        let topicFilename = path.join(options.docs, `${basename}`);
        topicFilename = path.extname(topicFilename) === '' ? `${topicFilename}.${options.topicExtension}` : topicFilename;

        let topicContent = renderTemplateFile('topic', item, options);
        
        const pathPart = path.dirname(topicFilename);
        if (!fs.existsSync(pathPart)) {
            try {
                fs.mkdirSync(pathPart, { recursive: true });
            } catch (err) {
                console.error(`Error creating directory ${pathPart}: ${err}`);
                throw err;
            }
        }
        
        fs.writeFileSync(topicFilename, topicContent, 'utf8');
    } catch (err) {
        console.error(err);
        throw err;
    }
    
    return basename;
}

/**
 * Retrieves the list of outline files based on the provided arguments and options.
 *
 * @param {Array<string>} args - The list of arguments to be used for filtering the outline files.
 * @param {Object} options - The options to be used for filtering the outline files.
 * @return {Array<string>} - The list of valid outline files.
 */
function getOutlineFiles(args, options) {

    args = args.length === 0 ? ['__outlines__/**/*.outline.yaml', '**/*.outline.yaml'] : args;
    args = args.map(filename => (path.extname(filename) === '' ? `${filename}.outline.yaml` : filename));

    let filenames = globSync(args);
    return filenames.filter(filename => isValidOutlineFile(filename, options));
}

function buildItems(items, options) {
    return items.map(item => {
        if (item.items && item.items.length > 0) {
            return {
                label: item.label,
                type: "category",
                items: buildItems(item.items, options)
            }
        } else {
            return createTopic(item, options);
        }
    })
}





