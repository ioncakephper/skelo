const { Command } = require('commander')
const { globSync } = require('glob')
const yamljs = require('yamljs')
const { isNull, isArray } = require('lodash');
const { saveDocument } = require('file-easy')
const hbsr = require('hbsr');

const { createTopicDocument,
    logMessage,
    buildItems,
    normalizeItem,
    getItemOptions,
} = require('./lib/skelo-utils')


let program = new Command()

let { version, name, description } = require('./package.json')

program
    .name(name)
    .version(version)
    .description(description)

program
    .command('build', { isDefault: true })
    .description('build topic files and sidebars structure file from outline definition files')
    .argument('[filenamePattern...]', 'filename pattern', [
        '__outlines__/**/*+(.yaml|.yml)',
        '**/*[Oo]utline+(.yaml|.yml)'
    ])
    .option('-d, --docs <path>', 'path to docs', 'docs')
    .option('-s, --sidebars <fullname>', 'fullname of sidebars', 'sidebars')
    .option('--sidebarsExtension <extension>', 'extension of sidebars', '.js')
    .option('--topicExtension <extension>', 'extension of topic', '.md')
    .option('-v, --verbose', 'verbose')

    .action((filenamePattern, options) => {
        let filenames = globSync(filenamePattern);

        filenames = filenames.filter(filename => !isNull(yamljs.load(filename) && isArray(yamljs.load(filename)['sidebars'])))

        let allDefinedSidebars = {}
        filenames.forEach(filename => {
            logMessage(options.verbose, `Processing ${filename}...`);
            let sidebars = yamljs.load(filename)['sidebars'].filter(sidebar => !isNull(sidebar));

            sidebars.forEach(sidebar => {

                sidebar = normalizeItem(sidebar);

                if (Object.keys(allDefinedSidebars).includes(sidebar.label)) {
                    console.log('[WARNING] Duplicate sidebar label', sidebar.label, 'in', filename)
                } else {
                    allDefinedSidebars[sidebar.label] = sidebar;
                    logMessage(options.verbose, `[INFO] successfully processed and added sidebar: ${sidebar.label} defined in ${filename}`) ;
                }
            }) 
        })
 

        let generatedSidebars = {}
        logMessage(options.verbose, `Start building sidebars...`)
        for (let sidebarDefinition in allDefinedSidebars) {
            let sidebar = allDefinedSidebars[sidebarDefinition]

            generatedSidebars[sidebarDefinition] = buildItems(sidebar.items, {
                ...options,
                ...getItemOptions(sidebar, options)
            })
        }
        logMessage(options.verbose, `End building sidebars...`)

        let sidebarsContent = hbsr.render_template('sidebars', { sidebars: JSON.stringify(generatedSidebars, null, 2) })


        let sidebarsFilename = options.sidebars //;

        saveDocument(sidebarsFilename, sidebarsContent)
        logMessage(options.verbose, `[INFO]created sidebars file: ${sidebarsFilename}`)

    }) 

program.parse()

