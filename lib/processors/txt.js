module.exports = async function (specs) {

    let module = specs.module;
    let type = specs.type;
    let config = specs.config;
    let finder = specs.finder;
    let minify = specs.minify;
    let error = specs.error;
    let language = specs.language;
    let template = specs.template;

    let files = [];

    // Add the files of the module
    files = files.concat(await (finder(module, type, 'txt', config)));

    if (template) {
        files = files.concat(await template.getCustomOverwrites(module, 'txt', error));
    }

    let fs = require('co-fs');

    function merge(o1, o2) {
        for (let prop in o2) {
            if (!o2.hasOwnProperty(prop)) continue;
            if (typeof o1[prop] === 'object' && typeof o2[prop] === 'object') {
                merge(o1[prop], o2[prop]);
            }
            else {
                o1[prop] = o2[prop];
            }
        }
        return o1;
    }

    let output = {};
    for (let file of files) {

        if (file.extname !== '.json') {
            throw new Error(`Invalid file extension "${file.relative.name}"`);
        }

        let t = await fs.readFile(file.file, {'encoding': 'utf8'});

        try {
            t = JSON.parse(t);
        }
        catch (exc) {
            throw new Error(exc.message);
        }

        if (typeof t !== 'object') {
            throw new Error('texts file is not an object');
        }

        merge(output, t);

    }

    if (!output) {
        resolve();
        return;
    }

    if (language) {
        output = output[language];
    }
    if (!output) {
        return;
    }

    output =
        '/************\n' +
        ' Module texts\n' +
        ' ************/\n\n' +

        `var texts = JSON.parse('${JSON.stringify(output)}');\n` +
        'if(!module.texts) module.texts = {};\n' +
        '$.extend(module.texts, texts);' +
        '\n\n';

    return output;

};
