var mustacheLib = require('/lib/xp/mustache');
var portalLib = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');
var contentLib = require('/lib/xp/content');

exports.get = function (req) {
    var imageId = req.params.image;

    var image;
    if (imageId) {
        image = imageXpertLib.getContentByKey(imageId);
    } else {
        image = imageXpertLib.getRandomImage();
    }

    var binary = contentLib.get({
        key: image.data.binary
    });

    var imageUrl = portalLib.imageUrl({
        id: image.data.binary,
        scale: "block(1,1)"
    });

    var infoPageUrl = imageXpertLib.generateInfoPageUrl({
        imagePath: image._path
    });

    var downloadImageServiceUrl = portalLib.serviceUrl({service: "download-image"});

    var view = resolve('download.html');
    var body = mustacheLib.render(view, {
        displayName: image.displayName,
        imageUrl: imageUrl,
        binaryImageId: image.data.binary,
        infoPageUrl: infoPageUrl,
        downloadImageServiceUrl: downloadImageServiceUrl
    });

    return {
        contentType: 'text/html',
        body: body
    };
};


