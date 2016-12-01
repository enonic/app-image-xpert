var portal = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');
var parentPath = './';
var view = resolve(parentPath + 'main.page.html');
var mustacheLib = require('/lib/xp/mustache');

function handleGet(req) {
/*    var albumId, albumName;

    if (req.params.albumId && imageXpertLib.getContentByKey(req.params.albumId)) {
        log.info(JSON.stringify(req, 4, 1));
        albumId = req.params.albumId;
        albumName = imageXpertLib.getContentByKey(req.params.albumId).displayName;
    }
    */
    var params = {
        albums: imageXpertLib.getAlbums(),
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


