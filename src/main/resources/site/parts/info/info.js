var contentLib = require('/lib/xp/content');
var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var imageId = req.params.image;

    var image = imageXpertLib.getContentByKey(imageId);
    var createdDate = new Date(image.createdTime);

    var binary = contentLib.get({
        key: image.data.binary
    });

    if (!binary) {
        return "<div></div>";
    }


    log.info("binary:%s", JSON.stringify(binary, null, 2));

    var artist;
    if (binary.data.artist) {
        artist = binary.data.artist.toString();
    }

    var geoLocation = binary.x.base && binary.x.base.gpsInfo && binary.x.base.gpsInfo.geoPoint;


    var imageWidth = binary.x.media.imageInfo.imageWidth.toFixed(0);
    var imageHeight = binary.x.media.imageInfo.imageHeight.toFixed(0);

    var view = resolve('info.html');
    var body = mustacheLib.render(view, {
        displayName: image.displayName,
        createdDate: createdDate.toDateString(),
        artist: artist,
        geoLocation: geoLocation,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
        contentType: binary.x.media.imageInfo.contentType,
        takenDate: new Date(binary.x.media.cameraInfo.date).toDateString(),
        cameraMake: binary.x.media.cameraInfo.make,
        cameraModel: binary.x.media.cameraInfo.model,
        assetUrl: portalLib.assetUrl('')
    });

    return {
        contentType: 'text/html',
        body: body
    };
}
;

