var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var categories = imageXpertLib.getCategories().
            filter(function (category) {
                return category.data.binaryImage;
            }).
            map(function (category) {
                /*var imageUrl = portalLib.imageUrl({
                    id: category.data.binaryImage,
                    scale: "square(220)"
                });*/
                var linkUrl = imageXpertLib.generateGalleryPageUrl({
                    categoryId: category._id
                });
                var getImagesParams = {
                    categoryId: category._id,
                    count: 3
                };
                return {
                    displayName: category.displayName.toLowerCase(),
                    images: imageXpertLib.
                        getImages(getImagesParams).
                        map(function (image) {
                            return {
                                imageUrl: portalLib.imageUrl({
                                    id: image.data.binary,
                                    scale: "square(200)"
                                })
                            }
                        }).
                        filter(function (image) {
                            return !!image
                        }),
                    linkUrl: linkUrl
                };
            });

    var galleryPageUrl = imageXpertLib.generateGalleryPageUrl();

    var view = resolve('home.html');
    var body = mustacheLib.render(view, {
        categories: categories,
        galleryPageUrl: galleryPageUrl,
        assetUrl: portalLib.assetUrl('')
    });

    return {
        contentType: 'text/html',
        body: body
    };
}
;

