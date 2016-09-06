var mustacheLib = require('/lib/xp/mustache');
var portalLib = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');
var contentLib = require('/lib/xp/content');

exports.get = function (req) {
    var image;
    if (req.params.imageId) {
        image = imageXpertLib.getContentByKey(req.params.image);
    } else {
        image = portalLib.getContent();
    }
    if (!image || image.type != "media:image") {
        image = imageXpertLib.getRandomImage();
    }

    var binary = contentLib.get({
        key: image._id
    });

    var imageWidth = binary.x.media.imageInfo.imageWidth.toFixed(0);
    var imageHeight = binary.x.media.imageInfo.imageHeight.toFixed(0);

    var imageUrl = portalLib.attachmentUrl({
        id: image._id
    });

    var downloadImageServiceUrl = portalLib.serviceUrl({service: "download-image"});

    var view = resolve('download.html');
    var body = mustacheLib.render(view, {
        displayName: image.displayName,
        imageUrl: imageUrl,
        binaryImageId: image._id,
        downloadImageServiceUrl: downloadImageServiceUrl,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
        contentType: binary.x.media.imageInfo.contentType,
        assetUrl: portalLib.assetUrl('')
    });

    return {
        contentType: 'text/html',
        body: body
    };
};


