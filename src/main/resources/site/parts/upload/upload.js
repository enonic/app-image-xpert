var portal = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var imageCreationServiceUrl = portal.serviceUrl({service: "create-image"});
    var albums = imageXpertLib.getAlbums().
        map(function (album) {
            return {
                id: album._id,
                displayName: album.displayName,
                checked: (req.params.album == album._id) ? "checked" : ""
            };
        });

    var params = {
        imageCreationServiceUrl: imageCreationServiceUrl,
        albums: albums
    };

    var view = resolve('upload.html');
    var body = mustacheLib.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
};

