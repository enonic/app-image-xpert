var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var categories = imageXpertLib.getCategories().
            map(function (category) {
                var imageUrl;
                var linkUrl = imageXpertLib.generateGalleryPageUrl({
                    categoryId: category._id
                });
                var categoryImage = imageXpertLib.getCategoryImage(category._id);

                if (categoryImage) {
                    imageUrl = portalLib.imageUrl({
                        id: categoryImage.data.binary,
                        scale: "square(150)"
                    })
                }

                return {
                    displayName: category.displayName.toLowerCase(),
                    stackType: "stack-type-" + parseInt((Math.random() * 5) + 1),
                    imageUrl: imageUrl,
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

