var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var contentLib = require('/lib/xp/content');

exports.get = function (req) {
    var postUrl = portal.componentUrl({});
    var redirectPageId = portal.getContent()._id;

    var params = {
        postUrl: postUrl,
        multipartRedirect: redirectPageId
    };

    var view = resolve('multipart.html');
    var body = thymeleaf.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
};

exports.post = function (req) {
    var multipartForm;

    multipartForm = portal.getMultipartForm();
    log.info('Multipart %s', multipartForm);
    var contentIds = createMedia(multipartForm);

    var pageId = portal.getMultipartText('multipartRedirect');
    var redirectUrl = portal.pageUrl({
        id: pageId,
        params: {
            ids: contentIds.join(',')
        }
    });

    return {
        redirect: redirectUrl
    };
};

function createMedia(multipartForm) {
    var media, part, contentIds = [];

    var uploadFolder = contentLib.get({
        key: '/image-xpert/images'
    });
    if (!uploadFolder) {
        log.info('Upload folder not found');
        return [];
    }

    part = portal.getMultipartItem("file", 0);
    if (part.fileName && part.size > 0) {
        media = contentLib.createMedia({
            name: part.fileName,
            parentPath: uploadFolder._path,
            mimeType: part.contentType,
            focalX: 0.5,
            focalY: 0.5,
            data: portal.getMultipartStream("file", 0)
        });
        log.info('Media created: %s', media);
        contentIds.push(media._id);
    }
    return contentIds;
}