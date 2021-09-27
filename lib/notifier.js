const colors = require('colors')

let allow = false;

/**
 * Log message if allowed.
 *
 * @param {string} message string to print to console.
 */
function notify(message) {
    if (this.allow) {
        console.log(notification(message))
    }
}

/**
 * Create a string prefixed with 'notice' in green.
 *
 * @param {string} message 
 * @return {string} string prefixed with green 'notice'
 */
function notification(message) {
    return `${colors.green('notice')} ${message}`
}

module.exports = {
    allow: allow,
    notify: notify
}