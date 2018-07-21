/**
 * Recursively find all the files of a directory.
 *
 * @param root {string} The directory where to find the files.
 * @param dir {string} The directory being recursively processed.
 * @param filter {function}
 * @returns {Promise<Array|*>}
 */
let readdir = async function (root, filter, dir) {

    const fs = require('./fs.js');

    dir = (dir) ? dir : root;

    let output = [];

    let files = await fs.readdir(dir);
    for (let file of files) {

        file = require('path').join(dir, file);

        let stat = await fs.stat(file);
        if (stat.isDirectory()) {
            output = output.concat(await readdir(root, filter, file));
        }
        else if (stat.isFile()) {

            file = new (require('./file'))(root, file);

            if (!filter || filter(file)) {
                output.push(file);
            }

        }

    }

    return output;

};

module.exports = readdir;
