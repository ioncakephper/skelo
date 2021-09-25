const path   = require("path");
const yamljs = require("yamljs");

/**
 *
 *
 * @param {*} outlines
 * @param {*} options
 * @param {*} commander
 * @return {*} 
 */
function buildAllSidebars(outlines, options, commander) {
  let allSidebars = [];
  let outlineSidebars = outlines.map((outline) => {
    return loadOutlineSidebars(outline, options, commander);
  });
  outlineSidebars.forEach((fileSidebars) => {
    fileSidebars.forEach((item) => allSidebars.push(item));
  });
  return allSidebars;
}

/**
 *
 *
 * @param {*} outline
 * @param {*} options
 * @param {*} commander
 * @return {*} 
 */
function loadOutlineSidebars(outline, options, commander) {
  const ext = path.extname(outline);
  const isYamlFile = [".yaml", ".yml"].includes(ext);

  return isYamlFile
    ? loadYaml(outline, options, commander)
    : convertMd2Yaml(outline, options, commander);
}

/**
 *
 *
 * @param {*} outline
 * @param {*} options
 * @param {*} commander
 * @return {*} 
 */
function loadYaml(outline, options, commander) {
  let content = {
    sidebars: [
      {
        sidebar: "docs",
      },
    ],
  };
  return content.sidebars;
}

/**
 *
 *
 * @param {*} outline
 * @param {*} options
 * @param {*} commander
 * @return {*} 
 */
function convertMd2Yaml(outline, options, commander) {
  let yamlSource = `sidebars:
    - sidebar: docs
      items:
        - Introduction
`;
  return yamljs.parse(yamlSource).sidebars;
}

module.exports = {
  buildAllSidebars: buildAllSidebars,
  convertMd2Yaml: convertMd2Yaml,
  loadYaml: loadYaml,
  loadOutlineSidebars: loadOutlineSidebars,
};
