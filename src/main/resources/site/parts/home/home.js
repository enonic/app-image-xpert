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
            var linkUrl = portalLib.pageUrl({
                path: "/image-xpert/categories/" + category._name
            });
            return {
                displayName: category.displayName,
                imageUrl: imageUrl,
                linkUrl: linkUrl
            };
        });

    var view = resolve('home.html');
    var body = mustacheLib.render(view, {categories: categories});

    return {
        contentType: 'text/html',
        body: body
    };
}
;

