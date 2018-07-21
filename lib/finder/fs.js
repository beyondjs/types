const fs = require('fs');
const {promisify} = require('util');

module.exports = {
    'exists': promisify(fs.exists),
    'stat': promisify(fs.stat),
    'readdir': promisify(fs.readdir)
};
