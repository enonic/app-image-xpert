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
            var linkUrl = imageXpertLib.generateGalleryUrl({
                categoryId: category._id
            });
            return {
                displayName: category.displayName,
                linkUrl: linkUrl,
                checked: ""
            };
        });
    var noCategoryUrl = imageXpertLib.generateGalleryUrl();
    categories.push({
        displayName: "None",
        linkUrl: noCategoryUrl,
        checked: ""
    });


    //Retrieves the images for the current category and search query
    var getImagesParams = req.params.category ? {categoryId: req.params.category} : undefined;
    var images = imageXpertLib.getImages(getImagesParams).
        map(function (image) {
            return {
                displayName: image.displayName,
                imageUrl: portalLib.imageUrl({
                    id: image.data.binary,
                    scale: "square(256)"
                })
            }
        });
    log.info("images: %s", JSON.stringify(images, null, 2));

    var view = resolve('gallery.html');
    var body = mustacheLib.render(view, {
        categories: categories,
        images: images
    });

    return {
        contentType: 'text/html',
        body: body
    };
};

