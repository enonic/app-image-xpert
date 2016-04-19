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
                checked: ""
            };
        });
    var noCategoryUrl = imageXpertLib.generateGalleryPageUrl();
    categories.push({
        displayName: "None",
        linkUrl: noCategoryUrl,
        checked: ""
    });


    //Retrieves the images for the current category and search query
    var getImagesParams = req.params.category ? {categoryId: req.params.category} : undefined;
    var images = imageXpertLib.getImages(getImagesParams).
        map(function (image) {
            var imageBinary = imageXpertLib.getContentByKey(image.data.binary);
            var artist = imageBinary.data.artist ? imageBinary.data.artist.toString() : undefined;

            return {
                displayName: image.displayName,
                artist: artist,
                imageUrl: portalLib.imageUrl({
                    id: image.data.binary,
                    scale: "square(256)"
                }),
                downloadPageUrl: imageXpertLib.generateDownloadPageUrl({
                    imageId: image._id
                })
            }
        });

    var uploadPageUrl = imageXpertLib.generateUploadPageUrl();

    var view = resolve('gallery.html');
    var body = mustacheLib.render(view, {
        categories: categories,
        images: images,
        uploadPageUrl: uploadPageUrl
    });

    return {
        contentType: 'text/html',
        body: body
    };
};

