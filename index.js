const program   = require("commander");
const fileEasy  = require("file-easy");
const fs        = require("fs");
const hbsr = require("hbsr");
const path = require("path");


const sklib     = require('./lib/sklib')
const sktopic   = require('./lib/sktopic')

let config;
if (fs.existsSync('./skelo.json')) {
    config = require('./skelo.json')
} else {
    config = {
        "build": {
            extension: ".md",
            sidebars: "./sidebars.js",
            docs: "./docs",
            summary: false,
            overview: '{{label}} overview'
        }
    }
}
const version = require("./package.json").version;
program
  .description(
    "Generate files for Docusaurus-powered documentation from outline files"
  )
  .version(version)
  .name("skelo");


program
    .command("init")
    .description("initializes current folder")
    .action((options, commander) => {
        
        let configuration = './skelo.json'
        fileEasy.saveDocument(configuration, JSON.stringify(config, null, 4))
    });

program
  .command("build", { isDefault: true })
  .description(
    "build files for Docusaurus-powered documention from outline files"
  )
  .argument("[outlines...]", "pattern to outline files", ["skelo"])

  .option(
    "-e, --extension <value>",
    "default extension for outline files",
    ".md"
  )
  .option("-s, --sidebars <file>", "path to sidebars file", "./sidebars.js")
  .option("-d, --docs <path>", "path to docs folder", "./docs")
  .option("--summary", "generate summary pages for each parent topic")
  .option(
    "--overview <string>",
    "Template string to use for summary pages",
    "{{label}} overview"
  )
  .option('-t, --templates <path>', 'path to templates folder', path.join(__dirname, 'templates'))
  .option("--hide-summary", "hide summary pages for all summary pages unless")

  .action((outlines, options, commander) => {
      // console.log(JSON.stringify(options, null, 4))
      console.log(JSON.stringify(commander.opts(), null, 4));
    outlines = outlines.map(pattern => fileEasy.setDefaultExtension(pattern, options.extension))
    outlines = outlines.filter(pattern => fs.existsSync(pattern))

    // console.log(JSON.stringify(outlines, null, 4));

    let allSidebars = sklib.buildAllSidebars(outlines, options, commander)
    console.log(JSON.stringify(allSidebars, null, 4))
    let allSidebarsLayout = sktopic.buildAllLayout(allSidebars, options, commander)
    console.log(JSON.stringify(allSidebarsLayout, null, 4))

    let sidebarsFilename = fileEasy.setDefaultExtension(options.sidebars, ".js")
    let content = hbsr.render_template('sidebars', {
        content: JSON.stringify(allSidebarsLayout, null, 4)
    })
    fileEasy.saveDocument(sidebarsFilename, content)
  });

program
  .command("clear")
  .description("clear documentation folder")
  .argument(
    "[pattern...]",
    "folder or file pattern(s) to remove from docs",
    "./docs/*.*"
  )

  .option(
    "-e, --exclude <pattern...>",
    "folder or file patterns to exclude from removing from docs"
  )
  .option("-c, --config <configuration>", "path to configuration file");


program.parse("node index.js init".split(/ +/g));
