/**
 * Returns the script of a "code" type
 *
 * @param config {object} The type configuration
 * @param error
 */
module.exports = function (config, error) {

    config.multilanguage = (config.multilanguage === undefined) ? true : !!config.multilanguage;

    Object.defineProperty(this, 'config', {
        'get': () => config
    });

    Object.defineProperty(this, 'extname', {
        'get': () => '.js'
    });

    Object.defineProperty(this, 'code', {
        'get': require('./code.js')(module, language)
    });
    Object.defineProperty(this, 'start', {
        'get': require('./start.js')(module, config, error)
    });

};
