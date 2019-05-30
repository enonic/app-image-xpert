var portal = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');
var parentPath = './';
var view = resolve(parentPath + 'main.page.html');
var mustacheLib = require('/lib/mustache');

function handleGet(req) {

    var params = {
        albums: imageXpertLib.getAlbums(),
        isLive: (req.mode == 'live'),
        appVersion: app.version,
        createAlbumUrl: portal.serviceUrl({service: "create-album"}),
        renameAlbumUrl: portal.serviceUrl({service: "rename-album"}),
        searchPageUrl: portal.serviceUrl({service: "search"}),
        loadAlbumsUrl: portal.serviceUrl({service: "load-albums"}),
        deleteServiceUrl: portal.serviceUrl({service: "delete-content"}),
        assetUrl: portal.assetUrl(''),
        baseUrl: imageXpertLib.generateHomeUrl()
    };
    
    var body = mustacheLib.render(view, params);

    return {
        contentType: 'text/html',
        headers: {
            'Service-Worker-Allowed': '/'
        },
        body: body
    };
}

exports.get = handleGet;


