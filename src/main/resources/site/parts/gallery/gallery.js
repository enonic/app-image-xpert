var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
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

    var view = resolve('gallery.html');
    var body = mustacheLib.render(view, {categories: categories});

    return {
        contentType: 'text/html',
        body: body
    };
};

