module.exports = function (root, file) {
    'use strict';

    if (!root || !file) {
        throw new Error('Parameters root and file are both required');
    }

    let relative = new (require('./relative.js'))(root, file);
    Object.defineProperty(this, 'relative', {
        'get': () => relative
    });

    // Remove trailing slashes
    root = root.replace(/([\/\\])+$/, '');
    Object.defineProperty(this, 'root', {
        'get': () => root
    });

    Object.defineProperty(this, 'file', {
        'get': () => file
    });
    Object.defineProperty(this, 'dirname', {
        'get': () => require('path').dirname(file)
    });
    Object.defineProperty(this, 'basename', {
        'get': () => require('path').basename(file, this.extname)
    });
    Object.defineProperty(this, 'extname', {
        'get': () => require('path').extname(file)
    });
    Object.defineProperty(this, 'filename', {
        'get': () => require('path').basename(file)
    });

};
