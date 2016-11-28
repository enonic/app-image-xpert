var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

function getAlbums() {
    return imageXpertLib.getAlbums().
        map(function (album) {
            var imageUrl;
            var albumImage = imageXpertLib.getAlbumImage(album._path);
            if (albumImage) {
                imageUrl = portalLib.imageUrl({
                    id: albumImage._id,
                    scale: "square(225)"
                })
            }

            return {
                displayName: album.displayName,
                stackType: "stack-type-" + parseInt((Math.random() * 5) + 1),
                imageUrl: imageUrl,
                albumId: album._id
            };
        });
}

exports.get = function (req) {
    /*var albums = [];

    for (var i=0; i<10; i++) {
        albums = albums.concat(getAlbums());
    }
*/
    var view = resolve('home.html');
/*    var albumId;

    if (req.params.albumId && imageXpertLib.getContentByKey(req.params.albumId)) {
        albumId = req.params.albumId;
    }
*/
    var body = mustacheLib.render(view, {
        //albums: albums,
        assetUrl: portalLib.assetUrl(''),
        imageCreationServiceUrl: portalLib.serviceUrl({service: "create-image"}),
        //albumId: albumId,
        //albumName: albumId ? imageXpertLib.getContentByKey(req.params.albumId).displayName : '',
        homePageUrl: imageXpertLib.generateHomeUrl()
    });

    return {
        contentType: 'text/html',
        body: body
    };
}
;

