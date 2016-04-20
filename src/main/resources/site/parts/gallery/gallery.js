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
                categoryId: category._id,
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
            var artist = imageBinary.data.artist ? imageBinary.data.artist.toString() : undefined;

            return {
                displayName: image.displayName,
                artist: artist,
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

    var view = resolve('gallery.html');
    var body = mustacheLib.render(view, {
        categories: categories,
        images: images,
        homePageUrl: homePageUrl,
        uploadPageUrl: uploadPageUrl,
        assetUrl: portalLib.assetUrl('')
    });

    return {
        contentType: 'text/html',
        body: body
    };
};

