var imageXpertLib = require('/lib/image-xpert');

function handleGet(req) {
    var images = imageXpertLib.getImages();
    return {
        contentType: 'application/json',
        body: JSON.stringify(images)
    };
}

exports.get = handleGet;
