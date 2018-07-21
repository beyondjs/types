module.exports = async function (specs) {

    let module = specs.module;
    let type = specs.type;
    let config = specs.config;
    let finder = specs.finder;
    let minify = specs.minify;
    let error = specs.error;

    let files = await finder(module, type, 'js', config);

    let fs = require('co-fs');

    let output = '';
    for (let file of files) {

        if (file.extname !== '.js') {
            throw new Error('invalid file extension "' + file.relative.file + '"');
        }

        let js = await fs.readFile(file.file, {'encoding': 'utf8'});

        let header = '';
        header += '/';
        header += (new Array(file.relative.file.length).join('*'));
        header += '\n' + file.relative.file + '\n';
        header += (new Array(file.relative.file.length).join('*'));
        header += '/\n\n';

        output += header + js + '\n\n';

    }

    return output;

};
