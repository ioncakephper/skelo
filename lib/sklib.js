const fileEasy              = require("file-easy");
const fs                    = require("fs");
const {isArray, isString, isObject}   = require('lodash')
const md                    = require('markdown').markdown;
const path                  = require("path");
const yamljs                = require("yamljs");


/**
 * Build list of sidebar descriptions from outline files.
 *
 * @param {Array<string>} outlines file path array, each item is an outline file.
 * @param {*} options
 * @param {*} commander
 * @return {Array<object>} array of objects, each object contains a sidebar.
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
 * Load all sidebars described in a file. It can be either a .md or .yaml file.
 *
 * @param {string} outline file path of an outline file, eiher in .md or .yaml format
 * @param {*} options
 * @param {*} commander
 * @return {Array<object>}  array of objects, each object describes a sidebar
 */
function loadOutlineSidebars(outline, options, commander) {
  const ext = path.extname(outline);
  const isYamlFile = [".yaml", ".yml"].includes(ext);

  return isYamlFile
    ? loadYamlOutline(outline, options, commander)
    : convertMd2Yaml(outline, options, commander);
}

/**
 * Load all sidebars described in a .yaml formatted file.
 *
 * @param {*} outline file path of an outline file in .yaml
 * @param {*} options
 * @param {*} commander
 * @return {*} 
 */
function loadYamlOutline(outline, options = {}, commander = {}) {

  let content = yamljs.load(outline)
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
  let tree = md.parse(fs.readFileSync(outline, 'utf-8'));

  let groups = getGroups(tree);

  let project = {
      sidebars: groups.map((group) => {
          let sbItem = {
              sidebar: group[0][2],
              items: convertItems(group[1])
          }

          sbItem = {
            ...sbItem,
            ...convertSidebarAttributes(group[1])
          }

          return sbItem;
      })
  }; 

  let output = yamljs.stringify(project, 256, 4)
  let ext = path.extname(outline);
  let tempYamlOutline = path.basename('temp-' + outline, ext) + '.yaml'

  fileEasy.saveDocument(tempYamlOutline, output)
  let result = loadYamlOutline(tempYamlOutline, options, commander);
  fs.rmSync(tempYamlOutline);
  return result
}

function convertSidebarAttributes(bulletlist) {
  let sidebarAttributes = {}

  let items = [];
  if (!isBulletList(bulletlist)) {
      return items;
  }

  // skip "bulletlist"
  let bulletitems = bulletlist.slice(1);

  // attribute items start with '@'
  let attributeItems = bulletitems.filter((item) => {
      return isAttributeItem(item);
      // return true;
  })

  sidebarAttributes = convertItemAttributes(attributeItems)

  return sidebarAttributes;
}

function convertItems(bulletlist, attributes = {}) {
  let items = [];
  if (!isBulletList(bulletlist)) {
      return items;
  }

  // skip "bulletlist"
  let bulletitems = bulletlist.slice(1);

  // topic items DO NOT start with '@'
  let topicItems = bulletitems.filter((item) => {
      return !isAttributeItem(item);
      // return true;
  })

  // convert topic items
  items = topicItems.map((bulletitem) => {

      // get attribute bullet items and convert them into attributes
      let attrItems = [];
      if (hasChildren(bulletitem)) {
          attrItems = bulletitem[2].filter((attr) => {
              return isAttributeItem(attr);
          })
      }  
      let attributes = convertItemAttributes(attrItems);

      // convert topic into json object
      let topic = {
          ...{
              label: bulletitem[1]
          },
          ...attributes,
          ...getSubtopics(bulletitem[2]),
      }
      if (Object.keys(topic).length > 1) {
          return topic
      }
      return bulletitem[1];
  })

  return items;
}

function getSubtopics(bulletlist = []) {
  let subTopics = convertItems(bulletlist)
  if (subTopics.length > 0) {
      return {
          "items": subTopics
      }
  }
  return {}
}

/**
* Check whether bullet item defines an attribute
*
* @param {["bulletitem", string, array?]} item Bullet item definition
* @returns boolean `true` if string defines an attribute, `false` otherwise
*/
function isAttributeItem(item) {
  let v = (item[1].substr(0, 1) == '@');
  return v;
}

function convertItemAttributes(attributeItems = []) {
  let attributes = {}
  attributeItems.forEach((attr) => {

      let attrname = attr[1].split(' ')[0].substr(1);
      attributes[attrname] = attr[1].split(' ').splice(1).join(' ')
  })
  return attributes;
}

function processAttribute(attributeItem) {
  return {
      "title": attributeItem[1]
  }
}

function hasChildren(g) {
  return isBulletItem(g) && isBulletList(g[2]);
}

function getGroups(tree) {
  let groups = [];
  if (tree[0] !== 'markdown') {
      return groups;
  }

  let sourceTree = tree.slice(1);
  for (let i = 0; i < sourceTree.length - 1; i++) {
      let p1 = sourceTree[i];
      let p2 = sourceTree[i + 1];
      if (isHeader(p1) && isBulletList(p2)) {
          groups.push([
              p1,
              p2,
          ])
      }
  }
  return groups;
}

function isHeader(g) {
  return (isArray(g) && (g.length == 3) && (g[0] === "header") && (isObject(g[1])) && (g[1]["level"] == 2) && (isString(g[2])));
}


function isBulletList(g) {
  return (isArray(g) && (g[0] === "bulletlist") && (g.length > 1) && (g.slice(1).every((item) => {
      return (isBulletItem(item));
  })));
}

function isBulletItem(g) {
  return (isArray(g) && (g[0] == "listitem") && (isString(g[1])) && (g.length > 1))
}

module.exports = {
  buildAllSidebars: buildAllSidebars,
  convertMd2Yaml: convertMd2Yaml,
  loadYamlOutline: loadYamlOutline,
  loadOutlineSidebars: loadOutlineSidebars,
};
