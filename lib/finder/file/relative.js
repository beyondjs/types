module.exports = function (root, file) {

    if (file.substr(0, root.length) !== root) {
        throw new Error('Invalid relative file specification');
    } else if (file.length <= root.length) {
        throw new Error('Invalid relative file specification');
    }

    file = file.substr(root.length + 1);

    Object.defineProperty(this, 'file', {
        'get': () => file
    });
    Object.defineProperty(this, 'dirname', {
        'get': () => require('path').dirname(file)
    });

};
