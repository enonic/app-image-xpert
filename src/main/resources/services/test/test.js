var imageXpertLib = require('/lib/image-xpert');

function handleGet(req) {
    return {
        contentType: 'application/json',
        body: {
            imageBinaryIds: imageXpertLib.getImageBinaryIds(),
            categories: imageXpertLib.getCategories()
        }
    };
}

exports.get = handleGet;
