var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');

exports.post = function (req) {
    log.info("Create image req:" + JSON.stringify(req, null, 2));

    var multipartForm = portal.getMultipartForm();
    log.info("Create image multipartForm:" + JSON.stringify(multipartForm, null, 2));
    createMedia(multipartForm);

    var pageId = portal.getMultipartText('multipartRedirect');
    var redirectUrl = portal.pageUrl({id: pageId});

    return {
        redirect: redirectUrl
    };
};

function createMedia() {
    var media, part;

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
    }
}