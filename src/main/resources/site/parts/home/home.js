var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var count = 0,
        categories = imageXpertLib.getCategories().
        filter(function (category) {
            return category.data.binaryImage;
        }).
        map(function (category) {
            var imageUrl = portalLib.imageUrl({
                id: category.data.binaryImage,
                scale: "block(220,147)"
            });
            var linkUrl = imageXpertLib.generateGalleryPageUrl({
                categoryId: category._id
            });
            return {
                displayName: category.displayName.toLowerCase(),
                imageUrl: imageUrl,
                linkUrl: linkUrl,
                newRow: (count == 4)
            };
        });

    var uploadPageUrl = imageXpertLib.generateUploadPageUrl();

    var view = resolve('home.html');
    var body = mustacheLib.render(view, {
        categories: categories,
        uploadPageUrl: uploadPageUrl,
        assetUrl: portalLib.assetUrl('')
    });

    return {
        contentType: 'text/html',
        body: body
    };
}
;

