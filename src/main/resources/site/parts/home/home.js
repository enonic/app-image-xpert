var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var categories = imageXpertLib.getCategories().
        filter(function (category) {
            return category.data.binaryImage;
        }).
        map(function (category) {
            var imageUrl = portalLib.imageUrl({
                id: category.data.binaryImage,
                scale: "square(64)"
            });
            var linkUrl = imageXpertLib.generateGalleryUrl({
                categoryId: category._id
            });
            return {
                displayName: category.displayName,
                imageUrl: imageUrl,
                linkUrl: linkUrl
            };
        });

    var uploadPageUrl = imageXpertLib.generateUploadUrl();

    var view = resolve('home.html');
    var body = mustacheLib.render(view, {
        categories: categories,
        uploadPageUrl: uploadPageUrl
    });

    return {
        contentType: 'text/html',
        body: body
    };
}
;

