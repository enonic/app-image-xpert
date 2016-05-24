var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var albums = imageXpertLib.getAlbums().
        map(function (album) {
            var imageUrl;
            var albumImage = imageXpertLib.getAlbumImage(album._id);
            if (albumImage) {
                imageUrl = portalLib.imageUrl({
                    id: albumImage.data.binary,
                    scale: "square(150)"
                })
            }

            var linkUrl = imageXpertLib.generateGalleryPageUrl({
                albumId: album._id
            });

            return {
                displayName: album.displayName.toLowerCase(),
                stackType: "stack-type-" + parseInt((Math.random() * 5) + 1),
                imageUrl: imageUrl,
                linkUrl: linkUrl
            };
        });

    var galleryPageUrl = imageXpertLib.generateGalleryPageUrl();

    var view = resolve('home.html');
    var body = mustacheLib.render(view, {
        albums: albums,
        galleryPageUrl: galleryPageUrl,
        assetUrl: portalLib.assetUrl('')
    });

    return {
        contentType: 'text/html',
        body: body
    };
}
;

