var portal = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');
var parentPath = './';
var view = resolve(parentPath + 'main.page.html');
var mustacheLib = require('/lib/xp/mustache');

function getAlbums() {
    return imageXpertLib.getAlbums().
            map(function (album) {
                var imageUrl;
                var albumImage = imageXpertLib.getAlbumImage(album._path);
                if (albumImage) {
                    imageUrl = portal.imageUrl({
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

function handleGet(req) {
/*    var albumId, albumName;

    if (req.params.albumId && imageXpertLib.getContentByKey(req.params.albumId)) {
        log.info(JSON.stringify(req, 4, 1));
        albumId = req.params.albumId;
        albumName = imageXpertLib.getContentByKey(req.params.albumId).displayName;
    }
    */
    var params = {
        albums: getAlbums(),
        //albumId: albumId,
        //albumName: albumName,
        createAlbumUrl: portal.serviceUrl({service: "create-album"}),
        renameAlbumUrl: portal.serviceUrl({service: "rename-album"}),
        searchPageUrl: portal.serviceUrl({service: "search"}),
        loadAlbumsUrl: portal.serviceUrl({service: "load-albums"}),
        assetUrl: portal.assetUrl(''),
        baseUrl: imageXpertLib.generateHomeUrl()
    };
    var body = mustacheLib.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
}

exports.get = handleGet;


