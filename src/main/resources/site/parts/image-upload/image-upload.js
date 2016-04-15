var portal = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');

exports.get = function (req) {
    var imageCreationServiceUrl = portal.serviceUrl({service: "create-image"});
    var redirectPageId = portal.getContent()._id;
    var categories = imageXpertLib.getCategories().
        map(function (category) {
            return {"name": category._name, "displayName": category.displayName};
        });

    var params = {
        imageCreationServiceUrl: imageCreationServiceUrl,
        redirectPageId: redirectPageId,
        categories: categories
    };

    var view = resolve('image-upload.html');
    var body = mustacheLib.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
};

