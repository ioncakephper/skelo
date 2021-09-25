const fileEasy = require('file-easy')
const {isUndefined, isString, isArray, isObject} = require('lodash')

/**
 *
 *
 * @param {*} sidebars
 * @param {*} options
 * @param {*} commander
 * @return {*} 
 */
function buildAllLayout(sidebars, options, commander) {
    let sb = {}
    sidebars.forEach(item => {
        // console.log(JSON.stringify(item, null, 4))
        const name = item.sidebar;
        sb[name] = buildSidebarItems(item.items, options, commander)
    })

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
    if (isUndefined(items))
        return []
    return items.map((item) => {
        item = create(item)

        if (isSingleTopic(item)) {

            let slug = getItemSlug(item);
            return slug;
        }

        return {
            type: "category",
            label: getItemLabel(item),
            items: buildSidebarItems(item.items, options, commander)
        }
    })
}

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function isSingleTopic(item) {
    item = create(item);
    return !isArray(item.items) || (item.items.length == 0)
}

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function create(item) {
    item = isString(item) ? {label: item} : item;
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
    let v = item.slug || getItemLabel(item)
    return fileEasy.slug(v)
}

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function getItemLabel(item) {
    item = create(item);
    return item.label.trim()
}

module.exports = {
    buildAllLayout: buildAllLayout
}