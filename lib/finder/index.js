module.exports = function (root, filter) {

    if (typeof root !== 'string') {
        throw new Error(`Parameter root value "${root}" is invalid`);
    }

    let processed;
    Object.defineProperty(this, 'processed', {
        'get': () => processed
    });

    let files;
    Object.defineProperty(this, 'files', {
        'get': () => files
    });

    this.process = async function () {

        if (processed) {
            return;
        }

        processed = true;
        files = await(require('./recursive.js'))(root, filter);

    };

};
