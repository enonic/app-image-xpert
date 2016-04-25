var contentLib = require('/lib/xp/content');
var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var image;
    if (req.params.image) {
        image = imageXpertLib.getContentByKey(req.params.image);
    } else {
        image = imageXpertLib.getRandomImage();
    }

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
        lat: geoLocation ? geoLocation.split(",")[0] : "",
        lng: geoLocation ? geoLocation.split(",")[1] : "",
        geoLocation: geoLocation,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
        contentType: binary.x.media.imageInfo.contentType,
        takenDate: binary.x.media.cameraInfo && binary.x.media.cameraInfo.date
            ? new Date(binary.x.media.cameraInfo.date).toDateString()
            : "N/A",
        cameraMake: binary.x.media.cameraInfo && binary.x.media.cameraInfo.make ? binary.x.media.cameraInfo.make : "N/A",
        cameraModel: binary.x.media.cameraInfo && binary.x.media.cameraInfo.model ? binary.x.media.cameraInfo.model : "N/A",
        assetUrl: portalLib.assetUrl('')
    });

    return {
        contentType: 'text/html',
        body: body
    };
}
;

