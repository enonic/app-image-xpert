var mustacheLib = require('/lib/xp/mustache');
var portalLib = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');


exports.get = function (req) {
    //Retrieves the albums
    var albumName = "All albums";
    var albums = imageXpertLib.getAlbums().
        map(function (album) {
            if (album._id == req.params.album) {
                albumName = album.displayName;
            }
            return {
                displayName: album.displayName,
                id: album._id,
                selected: (req.params.album == album._id) ? "selected" : ""
            };
        });

    //Retrieves the images for the current album or search query
    var getImagesParams = {
        albumId: req.params.album,
        searchQuery: req.params.search
    };

    var images = imageXpertLib.getImages(getImagesParams).
        map(function (image) {
            var caption = image.data.caption ? image.data.caption.toString() : undefined;
            var artist = image.data.artist ? image.data.artist.toString() : undefined;
            var copyright = image.data.copyright ? image.data.copyright.toString() : undefined;

            if (artist && copyright && artist.toLowerCase() == copyright.toLowerCase()) {
                artist = null;
            }

            return {
                displayName: image.displayName,
                caption: caption,
                artist: artist,
                copyright: copyright,
                imageUrl: portalLib.imageUrl({
                    id: image._id,
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
        albumId: req.params.album || undefined,
        albumName: albumName,
        galleryPageUrl: imageXpertLib.generateGalleryPageUrl({}),
        imageCreationServiceUrl: portalLib.serviceUrl({service: "create-image"})
    });

    return {
        contentType: 'text/html',
        body: body
    };
};

