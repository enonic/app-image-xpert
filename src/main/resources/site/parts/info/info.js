var contentLib = require('/lib/xp/content');
var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');

exports.get = function (req) {
    var image = portalLib.getContent();
    var createdDate = new Date(image.createdTime);


    var binary = contentLib.get({
        key: image.data.binary
    });


    log.info("binary:%s", JSON.stringify(binary, null, 2));

    var artist;
    if (binary.data.artist) {
        artist = binary.data.artist.toString();
    }

    var geoLocation;


    var imageWidth = binary.x.media.imageInfo.imageWidth.toFixed(0);
    var imageHeight = binary.x.media.imageInfo.imageHeight.toFixed(0);
    var imageUrl = portalLib.imageUrl({
        id: binary._id,
        scale: "square(256)"
    });


    var view = resolve('info.html');
    var body = mustacheLib.render(view, {
        displayName: image.displayName,
        createdDate: createdDate.toDateString(),
        artist: artist,
        geoLocation: binary.x.base.gpsInfo.geoPoint,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
        imageUrl: imageUrl
    });

    return {
        contentType: 'text/html',
        body: body
    };
}
;

