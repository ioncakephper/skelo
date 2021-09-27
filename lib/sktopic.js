const colors = require("colors");
const fileEasy = require("file-easy");
const hbsr = require("hbsr");
const { isUndefined, isString, isArray } = require("lodash");
const path = require("path");
const notifier = require("./notifier");

/**
 *
 *
 * @param {*} sidebars
 * @param {*} options
 * @param {*} commander
 * @return {*}
 */
function buildAllLayout(sidebars, options, commander) {
  let sb = {};
  sidebars.forEach((item) => {
    
    const name = item.sidebar;
    if (item.path) {
        options.path = getItemPath(item);
    }
    console.log(JSON.stringify(item, null, 4))
    console.log(JSON.stringify(options, null, 4))
    sb[name] = buildSidebarItems(item.items, options, commander);
  });

  return sb;
}

/**
 *
 *
 * @param {*} items
 * @param {*} options
 * @param {*} commander
 * @return {*}
 */
function buildSidebarItems(items, options, commander) {
  if (isUndefined(items)) return [];
  return items.map((item) => {
    item = create(item);

    if (isSingleTopic(item)) {

        if (item.href) {
            return {
                type: "link",
                label: getItemLabel(item),
                href: item.href
            }
        }
      let slug = getItemSlug(item);    
      buildTopicFile(slug, item, options, commander);

      slug = path.join(options.path || '.', slug)
      slug = slug.replace(/\\/g, '/')

      if (item.hidden) {
          return {
              type: "link",
              label: getItemLabel(item),
              href: slug,
          }
      }
      return slug;
    }

    if (options.folders) {
      item.path = getItemSlug(item);
      options = {
        ...options,
        ...{ path: path.join(options.path || ".", item.path) },
      };
    }
    if (options.summary) {
        item.summary = !item.nosummary;
    }

    if (item.summary) {
        console.log(JSON.stringify(options, null, 4))
        let summaryTitle = options.overview.replace(/\{\{label\}\}/g, item.label)
        let summaryTopic = create(summaryTitle)
        summaryTopic.hidden = options.hideSummary;
        item.items.unshift(summaryTopic);
    }

    return {
      type: "category",
      label: getItemLabel(item),
      items: buildSidebarItems(item.items, options, commander),
    };
  });
}

function buildTopicFile(topicFilename, item, options, commander) {
  notifier.allow = options.verbose;

  topicFilename = fileEasy.setDefaultExtension(topicFilename, ".md");
  topicFilename = path.join(options.docs, options.path || '.', topicFilename);

  let content = hbsr.render_template("topic", {
    title: getItemTitle(item),
  });

  fileEasy.saveDocument(topicFilename, content);
  notifier.notify(`${topicFilename} topic file ${colors.green("generated")}`);
}

/**
 *
 *
 * @param {*} item
 * @return {*}
 */
function isSingleTopic(item) {
  item = create(item);
  return !isArray(item.items) || item.items.length == 0;
}

/**
 *
 *
 * @param {*} item
 * @return {*}
 */
function create(item) {
  item = isString(item) ? { label: item } : item;
  return item;
}

/**
 *
 *
 * @param {*} item
 * @return {*}
 */
function getItemSlug(item) {
  item = create(item);
  let v = item.slug || getItemLabel(item);
  return fileEasy.slug(v);
}

/**
 *
 *
 * @param {*} item
 * @return {*}
 */
function getItemLabel(item) {
  item = create(item);
  return item.label.trim();
}

/**
 *
 *
 * @param {*} item
 * @return {*}
 */
function getItemTitle(item) {
  item = create(item);
  let v = item.title || getItemLabel(item);
  return v.trim();
}

function getItemPath(item) {
    item = create(item);
    let v = item.path || '';
    return fileEasy.slug(v)
}

module.exports = {
  buildAllLayout: buildAllLayout,
};
