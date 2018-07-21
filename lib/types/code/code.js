module.exports = function (config, language) {

    let scope = function (code, standalone) {

        // add an extra tab in all lines
        code = code.replace(/\n/g, '\n    ');
        code = `    ${code}\n`;

        // add script inside its own function
        let output = '';

        if (standalone) {
            output += '(function () {\n\n';
        }
        else {
            output += '(function (params) {\n\n';
            output += '    var done = params[1];\n';
            output += '    var module = params[0];\n';
            output += '    var react = module.react.items;\n\n';

            if (config.dependencies) {
                output += '    var dependencies = module.dependencies;\n';
                output += '    module.dependencies.set(' + JSON.stringify(config.dependencies) + ');\n\n';
            }
        }

        output += code;

        if (standalone) {
            output += '})();';
        }
        else {
            output += `    done('${module.id}', 'code');\n\n`;
            output += `})(beyond.modules.get('${module.id}'));`;
        }

        return output;

    };

    return async function () {

        let process = require('path').join(require('main.lib'), 'core/types/process');
        process = require(process);

        if (config.html) {
            config.mustache = config.html;
            delete config.html;
        }

        let script = await process({
            'module': module,
            'type': 'code',
            'config': config,
            'supports': ['less', 'css', 'txt', 'mustache', 'jsx', 'js'],
            'language': language
        });

        return scope(script, config.standalone);

    };

};
