var portalLib = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');

exports.post = function (req) {

    var imageUrl, width, height, scale, binaryImage;

    if (!req.params.width && !req.params.height && !req.params.formatname) {
        imageUrl = portalLib.attachmentUrl({
            id: req.params.binary,
            download: true
        });
    }
    else {

        if (!req.params.width || !req.params.height) {
            binaryImage = imageXpertLib.getContentByKey(req.params.binary);
        }

        width = req.params.width || binaryImage.x.media.imageInfo.imageWidth.toFixed(0);
        height = req.params.height || binaryImage.x.media.imageInfo.imageHeight.toFixed(0);

        scale = "block(" + width + "," + height + ")";

        imageUrl = portalLib.imageUrl({
            id: req.params.binary,
            scale: scale,
            format: req.params.formatname || undefined
        });
    }

    return {
        contentType: 'text/plain',
        body: imageUrl
    }

};