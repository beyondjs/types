/**
 * Returns the script of a "page" type
 */
module.exports = function (module, config, error) {
    'use strict';

    config.multilanguage = (config.multilanguage === undefined) ? true : !!config.multilanguage;

    Object.defineProperty(this, 'config', {
        'get': () => config
    });

    Object.defineProperty(this, 'extname', {
        'get': () => '.html'
    });

    Object.defineProperty(this, 'code', {
        'get': require('./code.js')(module, language)
    });
    Object.defineProperty(this, 'start', {
        'get': require('./start.js')(module, config, error)
    });

};
