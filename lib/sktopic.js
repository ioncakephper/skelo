const colors = require("colors");
const fileEasy = require("file-easy");
const hbsr = require("hbsr");
const { isUndefined, isString, isArray, isNull, isEmpty } = require("lodash");
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
          href: item.href,
        };
      }
      let parent = create({ label: "No label", path: options.path });
      let slug = getItemSlug(item);
      slug = path.join(
        getItemPath(parent) || ".",
        getItemPath(item) || ".",
        slug
      );
      // console.log('buildSingleTopic slug', slug);
      buildTopicFile(slug, item, options, commander);

      // slug = path.join(options.path || '.', slug)
      slug = slug.replace(/\\/g, "/");

      if (item.hidden) {
        return {
          type: "link",
          label: getItemLabel(item),
          href: slug,
        };
      }
      return slug;
    }

    if (options.folders) {
      item.path = getItemSlug(item);
      options = {
        ...options,
        ...{ path: path.join(options.path || ".", getItemPath(item)) },
      };
    }
    if (options.summary) {
      item.summary = !item.nosummary;
    }

    if (item.summary) {
      // console.log(JSON.stringify(options, null, 4))
      let overviewSource = item.overview || options.overview;
      let summaryTitle = overviewSource.replace(/\{\{label\}\}/g, getItemLabel(item))
      let summaryTopic = create(summaryTitle);
      summaryTopic.slug = getItemSlug(item);
      if (getItemSlug(summaryTopic) == getItemSlug(item)) {
        summaryTopic.slug += '-overview';
      }
      summaryTopic.hidden = options.hideSummary;
      summaryTopic.children = item.items.map((child) => {
        return {
          title: getItemTitle(child),
          url: getItemSlug(child),
          brief: child.brief,
        }
      })
      item.items.unshift(summaryTopic);
    }

    if (getItemPath(item)) {
      // options.path = path.join(options.path || '.', getItemPath(item));
      options.path = options.path
        ? `${options.path}/${getItemPath(item)}`
        : getItemPath(item);
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
  topicFilename = path.join(options.docs, topicFilename);

  let params = {
    title: getItemTitle(item),
    id:
      getItemSlug(item) != fileEasy.slug(getItemLabel(item))
        ? getItemSlug(item)
        : null,
    sidebar_label: (getItemLabel(item) != getItemTitle(item)) ? getItemLabel(item) : null,
    headings: buildTopicHeadings(item.headings),
    children: item.children,
  };

  let content = hbsr.render_template("topic", params);

  fileEasy.saveDocument(topicFilename, content);
  notifier.notify(`${topicFilename} topic file ${colors.green("generated")}`);
}

function buildTopicHeadings(headings, level = 2) {
  if (isUndefined(headings)) return undefined;
  if (!isArray(headings)) return undefined;

  let r = headings.map((item) => {
    item = create(item);
    return hbsr.render(`
{{{prefix}}} {{{title}}}
{{#if brief}}
{{{brief}}}
{{/if}}
{{#if subheadings}}
{{subheadings}}
{{/if}}`,
  {
    prefix: '#'.repeat(level),
    title: item.label,
    brief: item.brief,
    subheadings: buildTopicHeadings(item.items, level + 1)
  })
  })

  return r.join('\n')
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
 * Create a topic object from a string.
 *
 * When passed a string, return an object. When passed
 * an object, create the label attribute if needed, or
 * format the label value.
 *
 * @param {string|object} item content to convert to topic object.
 * @returns {object} topic object with label attribute added.
 */
function create(item) {
  item = isString(item) ? { label: item.trim() } : item;
  if (isUndefined(item.label)) item.label = "No label";
  item.label = isEmpty(item.label.trim()) ? "No label" : item.label;
  item.label = item.label.trim();
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
  let v;
  if (isUndefined(item.slug)) {
    v = getItemLabel(item);
  } else {
    v = isEmpty(item.slug.trim()) ? getItemLabel(item) : item.slug;
  }
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
  let v;
  if (isUndefined(item.title)) {
    v = getItemLabel(item);
  } else {
    v = isEmpty(item.title.trim()) ? getItemLabel(item) : item.title;
  }
  return v.trim();
}

function getItemPath(item) {
  item = create(item);
  if (isUndefined(item.path)) return;
  let v = item.path;
  v = v
    .split("/")
    .map((p) => {
      return fileEasy.slug(p);
    })
    .join("/");
  return v;
}

module.exports = {
  buildAllLayout: buildAllLayout,
  create: create,
  getItemLabel: getItemLabel,
  getItemSlug: getItemSlug,
  getItemTitle: getItemTitle,
  getItemPath: getItemPath,
  buildTopicFile: buildTopicFile,
};
