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
/*
function getImages(albumId) {
    var getImagesParams = {
        searchQuery: null, //req.params.search,
        albumId: albumId
    };

    return imageXpertLib.getImages(getImagesParams).
            map(function (image) {
                var caption = image.data.caption ? image.data.caption.toString() : image.displayName;
                var artist = image.data.artist ? image.data.artist.toString() : undefined;
                var copyright = image.data.copyright ? image.data.copyright.toString() : undefined;

                if (artist && copyright && artist.toLowerCase() == copyright.toLowerCase()) {
                    artist = null;
                }

                return {
                    caption: caption,
                    artist: artist,
                    copyright: copyright,
                    imageUrl: portal.imageUrl({
                        id: image._id,
                        scale: "square(250)"
                    }),
                    imagePageUrl: imageXpertLib.generateImagePageUrl({
                        imageId: image._id
                    })
                };
            }).filter(function (image) {
                return !!image
            });
}
*/
function handleGet(req) {
    var albumId, albumName;
    var homePageUrl = imageXpertLib.generateHomeUrl();

    log.info(JSON.stringify(req, 4, 1));
/*
    if (req.url.endsWith(homePageUrl) && !req.url.endsWith("/")) {
        return {
            redirect: req.url + "/abw/"
        };
    }
*/
    if (req.params.albumId && imageXpertLib.getContentByKey(req.params.albumId)) {
        albumId = req.params.albumId;
        albumName = imageXpertLib.getContentByKey(req.params.albumId).displayName;
    }
    
    var params = {
        albums: albumId ? [] : getAlbums(),
        //images: albumId ? getImages(albumId) : [],
        albumId: albumId,
        albumName: albumName,
        createImageUrl: portal.serviceUrl({service: "create-image"}),
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


