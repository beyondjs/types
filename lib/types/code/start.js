module.exports = function (module, config) {

    return async function () {

        if (!config.id) return;

        let script = '';
        script += `var modulePath = '/'${module.path}/code';\n`;
        script += 'var host;\n';

        if (module.application) {
            script += 'host = beyond.requireConfig.paths.application;\n';
        }
        else {
            script += 'host = beyond.requireConfig.paths[\'libraries/' + module.library.name + '\'];\n';
        }

        script += 'host += modulePath;\n';

        script += 'requirejs.config({\n';
        script += '    paths: {\n';
        script += '        \'' + config.id + '\': host\n';
        script += '    }\n';
        script += '});\n\n';

        return script;

    };

};
