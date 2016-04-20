var portalLib = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');

exports.post = function (req) {

    var scale;
    if (req.params.size == "original") {
        var binaryImage = imageXpertLib.getContentByKey(req.params.binary);
        log.info("binaryImage: %s", JSON.stringify(binaryImage, null, 2));

        var width = binaryImage.x.media.imageInfo.imageWidth;
        var height = binaryImage.x.media.imageInfo.imageHeight;
        scale = "block(" + width.toFixed(0) + "," + height.toFixed(0) + ")";
    } else {
        var width = req.params.width;
        var height = req.params.height;
        scale = "block(" + width + "," + height + ")";
    }

    log.info("req: %s", JSON.stringify(req, null, 2));

    var imageUrl = portalLib.imageUrl({
        id: req.params.binary,
        scale: scale,
        format: req.params.format == "custom" ? req.params.formatname : undefined
    });
    return {
        redirect: imageUrl
    };
};