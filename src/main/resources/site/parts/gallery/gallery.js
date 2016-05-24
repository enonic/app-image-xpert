var mustacheLib = require('/lib/xp/mustache');
var portalLib = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');


exports.get = function (req) {
    //Retrieves the albums
    var albums = imageXpertLib.getAlbums().
        map(function (album) {
            var linkUrl = imageXpertLib.generateGalleryPageUrl({
                categoryId: album._id
            });
            return {
                displayName: album.displayName,
                linkUrl: linkUrl,
                id: album._id,
                checked: (req.params.category == album._id) ? "checked" : ""
            };
        });

    //Retrieves the images for the current category and search query
    var getImagesParams = {
        categoryId: req.params.category,
        searchQuery: req.params.search
    };
    var images = imageXpertLib.getImages(getImagesParams).
        map(function (image) {
            var imageBinary = imageXpertLib.getContentByKey(image.data.binary);
            if (!imageBinary) {
                return undefined;
            }

            var caption = imageBinary.data.caption ? imageBinary.data.caption.toString() : undefined;
            var artist = imageBinary.data.artist ? imageBinary.data.artist.toString() : undefined;
            var copyright = imageBinary.data.copyright ? imageBinary.data.copyright.toString() : undefined;

            if (artist && copyright && artist.toLowerCase() == copyright.toLowerCase()) {
                artist = null;
            }

            return {
                displayName: image.displayName,
                caption: caption,
                artist: artist,
                copyright: copyright,
                imageUrl: portalLib.imageUrl({
                    id: image.data.binary,
                    scale: "max(1200)"
                }),
                downloadPageUrl: imageXpertLib.generateDownloadPageUrl({
                    imageId: image._id
                })
            }
        }).filter(function (image) {
            return !!image
        });

    var homePageUrl = imageXpertLib.generateHomeUrl();
    var imageCount = (images.length == 0 ? "no" : images.length) + " result";
    if (images.length !== 1) {
        imageCount += "s";
    }

    var view = resolve('gallery.html');
    var body = mustacheLib.render(view, {
        albums: albums,
        images: images,
        imageCount: imageCount,
        homePageUrl: homePageUrl,
        assetUrl: portalLib.assetUrl(''),
        searchQuery: req.params.search || undefined,
        categoryId: req.params.category
    });

    return {
        contentType: 'text/html',
        body: body
    };
};

