var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var albums = imageXpertLib.getAlbums().
        map(function (album) {
            var imageUrl;
            var linkUrl = imageXpertLib.generateGalleryPageUrl({
                categoryId: album._id
            });
            var categoryImage = imageXpertLib.getCategoryImage(album._id);

            if (categoryImage) {
                imageUrl = portalLib.imageUrl({
                    id: categoryImage.data.binary,
                    scale: "square(150)"
                })
            }

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

