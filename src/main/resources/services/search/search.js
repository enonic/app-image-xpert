var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');
var portalLib = require('/lib/xp/portal');

exports.post = function (req) {

    //Retrieves the images for the current album or search query
    var getImagesParams = {
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
                scale: "square(200)"
            }),
            downloadPageUrl: imageXpertLib.generateDownloadPageUrl({
                imageId: image._id
            })
        }
    }).filter(function (image) {
        return !!image
    });

    var view = resolve('./search.html');
    var body = mustacheLib.render(view, {
        images: images,
        imageCount: images.length || 'no',
        searchQuery: req.params.search || undefined
    });

    return {
        status: 200,
        contentType: 'text/html',
        body: body
    };
};