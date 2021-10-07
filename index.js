const colors = require("colors");
const program = require("commander");
const fileEasy = require("file-easy");
const fs = require("fs");
const glob = require("glob");
const hbsr = require("hbsr");
const path = require("path");
const notifier = require("./lib/notifier");
const sklib = require("./lib/sklib");
const sktopic = require("./lib/sktopic");

let config;
if (fs.existsSync("./skelo.config.json")) {
  config = require("./skelo.config.json");
} else {
  config = {
    build: {
      extension: ".md",
      sidebars: "./sidebars.js",
      docs: "./docs",
      summary: false,
      overview: "{{label}} overview",
    },
  };
}
const version = require("./package.json").version;
program
  .description(
    "Generate files for Docusaurus-powered documentation from outline files"
  )
  .version(version)
  .name("skelo");

program
  .command("build", { isDefault: true })
  .description(
    "(default) build files for Docusaurus-powered documention from outline files"
  )
  .argument("[outlines...]", "pattern to outline files", [
    "**/*.[oO]utline.@(yaml|yml|md|markdown)",
  ])

  .option(
    "-e, --extension <value>",
    "default extension for outline files",
    ".md"
  )
  .option("-d, --docs <path>", "path to docs folder", "./docs")
  .option("-f, --folders", "create folder for every parent topic")
  .option("--no-verbose", "inhibit sending progress messages to console. ")
  .option(
    "-o, --overview <string>",
    "Template string to use for summary pages",
    "{{label}} overview"
  )
  .option("-s, --sidebars <file>", "path to sidebars file", "sidebars.js")
  .option("--summary", "generate summary pages for each parent topic")
  .option(
    "-t, --templates <path>",
    "path to templates folder",
    path.join(__dirname, "templates")
  )


  .action((outlines, options, commander) => {
    notifier.allow = options.verbose;

    // retrieve outline files from patterns (default or specified)
    let outlineFiles = [];
    outlines.forEach((pattern) => {
      glob.sync(pattern).forEach((item) => outlineFiles.push(item));
    });

    let allSidebars = sklib.buildAllSidebars(outlineFiles, options, commander);
    let allSidebarsLayout = sktopic.buildAllLayout(
      allSidebars,
      options,
      commander
    );

    let sidebarsFilename = fileEasy.setDefaultExtension(
      options.sidebars,
      ".js"
    );
    let content = hbsr.render_template("sidebars", {
      content: JSON.stringify(allSidebarsLayout, null, 4),
    });
    fileEasy.saveDocument(sidebarsFilename, content);
    notifier.notify(`${sidebarsFilename} ${colors.green("generated")}`);
  });

program
  .command("clear")
  .description("clear docs folder contents")
  .argument("[dir...]", "Path to folders to clean", "docs")
  .option(
    "-e, --exclude <pattern...>",
    "Exclude from removing files and folders matching specified patterns",
    []
  )
  .option("--no-verbose", "Inhibit sending progress messages to console")
  .option(
    "-c, --config <filename>",
    "configuration file whose clear key is used for arguments and options",
    "skelo.config.json"
  )
  .action((dirs, options, commander) => {
    dirs = (typeof dirs == 'string') ? [dirs] : dirs;
    console.log(JSON.stringify(dirs, null, 4))
  });

program
  .command("init")
  .description("initializes current folder")
  .argument('[config]', 'path to configuration filename to create', 'skelo.config.json')
  .action((options, commander) => {
    let configuration = "./skelo.json";
    fileEasy.saveDocument(configuration, JSON.stringify(config, null, 4));
  });

program.parse();
// program.parse('node index.js'.split(/ +/g))
