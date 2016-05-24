var portal = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var imageCreationServiceUrl = portal.serviceUrl({service: "create-image"});
    var albums = imageXpertLib.getAlbums().
        map(function (category) {
            return {
                id: category._id,
                displayName: category.displayName,
                checked: (req.params.category == category._id) ? "checked" : ""
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

