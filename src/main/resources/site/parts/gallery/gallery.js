var mustacheLib = require('/lib/xp/mustache');
var portalLib = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');


exports.get = function (req) {
    //Retrieves the categories
    var categories = imageXpertLib.getCategories().
        filter(function (category) {
            return category.data.binaryImage;
        }).
        map(function (category) {
            var linkUrl = imageXpertLib.generateGalleryPageUrl({
                categoryId: category._id
            });
            return {
                displayName: category.displayName,
                linkUrl: linkUrl,
                id: category._id,
                checked: (req.params.category == category._id) ? "checked" : ""
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
    var uploadPageUrl = imageXpertLib.generateUploadPageUrl();
    var imageCount = (images.length == 0 ? "no" : images.length) + " result";
    if (images.length !== 1) {
        imageCount+="s";
    }

    var view = resolve('gallery.html');
    var body = mustacheLib.render(view, {
        categories: categories,
        images: images,
        imageCount: imageCount,
        homePageUrl: homePageUrl,
        uploadPageUrl: uploadPageUrl,
        assetUrl: portalLib.assetUrl(''),
        searchQuery: req.params.search || undefined,
        categoryId: req.params.category
    });

    return {
        contentType: 'text/html',
        body: body
    };
};

