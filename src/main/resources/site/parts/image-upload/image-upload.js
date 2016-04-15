var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function (req) {
    var imageCreationServiceUrl = portal.serviceUrl({service: "create-image"});
    var redirectPageId = portal.getContent()._id;

    var params = {
        imageCreationServiceUrl: imageCreationServiceUrl,
        redirectPageId: redirectPageId
    };

    var view = resolve('image-upload.html');
    var body = thymeleaf.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
};

