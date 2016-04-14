var portalLib = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');

function handleGet(req) {
    var imageBinaryIds = imageXpertLib.getImageBinaryIds();
    var imageUrls = imageBinaryIds.map(function (imageBinaryId) {
        return portalLib.imageUrl({
            id: imageBinaryId,
            scale: 'block(600,600)',
            filter: 'rounded(5);sharpen()'
        });
    });
    var categories = imageXpertLib.getCategories();

    return {
        contentType: 'application/json',
        body: {
            imageBinaryIds: imageBinaryIds,
            imageUrls: imageUrls,
            categories: categories
        }
    };
}

exports.get = handleGet;
