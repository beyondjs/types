function Dependencies(module, dependencies) {
    'use strict';

    let modules = {};
    Object.defineProperty(this, 'modules', {
        'get': function () {
            return modules;
        }
    });

    this.set = function (value) {

        if (dependencies) {
            console.error('Module dependencies can only be set once')
            return;
        }
        dependencies = value;

        if (dependencies.code) {
            dependencies.require = dependencies.code;
        }

        load();

    };

    let ready;
    Object.defineProperty(this, 'loaded', {
        'get': function () {
            return !!ready;
        }
    });

    let callbacks = [];

    function done() {

        ready = true;
        for (let i in callbacks) {
            callbacks[i](modules);
        }
        callbacks = [];

    }

    this.done = function (callback) {

        if (ready) {
            callback(modules);
            return;
        }
        callbacks.push(callback);

    };

    let coordinate = new Coordinate(
        'controls',
        'require',
        'react',
        done);

    function getResourcePath(resource) {

        if (resource.substr(0, 12) === 'application/') {
            return 'application/' + resource.substr(12);
        }

        if (resource.substr(0, 10) !== 'libraries/') {
            return resource;
        }

        let type;

        // Extract the type of the resource to get the moduleID
        let moduleID = (function (resource) {

            resource = resource.split('/');
            type = resource.pop();
            return resource.join('/');

        })(resource);

        let multilanguage = beyond.modules.multilanguage.get(moduleID);
        if (multilanguage && multilanguage.indexOf(type) !== -1) {
            return resource + '/' + beyond.params.language;
        }
        else {
            return resource;
        }

    }

    function load() {

        let mods = [];

        let dependency;
        for (let resource in dependencies.require) {
            mods.push(getResourcePath(resource));
        }

        // Wait for react to be ready if react is on the dependencies list
        if (mods.indexOf('react') !== -1) {
            module.react.done(coordinate.react);
        }
        else {
            coordinate.done('react');
        }

        if (mods.length) {

            require(mods, function () {

                let args = [].slice.call(arguments);

                let i = 0;
                for (dependency in dependencies.require) {

                    let name = dependencies.require[dependency];
                    modules[name] = args[i];
                    i++;

                }

                coordinate.done('require');

            });

        }
        else {
            coordinate.done('require');
        }

        if (dependencies.controls instanceof Array && dependencies.controls.length) {
            beyond.controls.import(dependencies.controls, coordinate.controls);
        }
        else {
            coordinate.done('controls');
        }

    }

    if (dependencies) load();

}
