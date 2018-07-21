module.exports = async function (specs) {
    'use strict';

    let module = specs.module;
    let type = specs.type;
    let config = specs.config;
    let supports = specs.supports;
    let language = specs.language;
    let template = specs.template;

    let processors = require('../').processors;

    let scripts = {};
    let length = 0;

    let files;
    files = require('./files');

    for (let processor in config) {

        let pError = require('./error.js')(module, type, processor);
        let minify = false;

        if (supports.indexOf(processor) === -1) {
            continue;
        }

        if (!processors.has(processor)) {
            // It is a configuration block of the type, but not a processor
            throw pError('Processor "' + processor + '" is not installed');
        }

        let process = processors.get(processor);
        scripts[processor] = await process({
            'module': module,
            'type': type,
            'config': config[processor],
            'finder': files,
            'minify': minify,
            'error': pError,
            'language': language,
            'template': template
        });

        length++;

    }

    let output = '';
    for (let processor of supports) {
        output += (scripts[processor]) ? scripts[processor] + '\n\n' : '';
    }

    // Remove the last two carriage return
    if (length) {
        output = output.substr(0, output.length - 2);
    }

    return output;

};
