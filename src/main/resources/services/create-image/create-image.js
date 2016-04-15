var portalLib = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var imageXpertLib = require('/lib/image-xpert');

exports.post = function (req) {
    var multipartForm = portalLib.getMultipartForm();
    log.info("Create image multipartForm:" + JSON.stringify(multipartForm, null, 2));
    createMedia();

    var pageId = portalLib.getMultipartText('multipartRedirect');
    var redirectUrl = portalLib.pageUrl({id: pageId});

    return {
        redirect: redirectUrl
    };
};

function createMedia() {
    var part = portalLib.getMultipartItem("file");
    if (part.fileName && part.size > 0) {

        var categoryName = portalLib.getMultipartText('categoryName');
        var category = imageXpertLib.getCategoryByName(categoryName);

        if (!category) {
            log.info('No category: %s', categoryName);
            return;
        }

        var content = contentLib.create({
            parentPath: '/image-xpert/images',
            displayName: part.fileName,
            contentType: app.name + ":image",
            branch: "draft",
            data: {
                category: category._id
            }
        });

        var media = contentLib.createMedia({
            name: part.fileName,
            parentPath: content._path,
            mimeType: part.contentType,
            branch: "draft", //TODO The lib function is missing a parameter branch
            focalX: 0.5,
            focalY: 0.5,
            data: portalLib.getMultipartStream("file")
        });

        contentLib.modify({
            key: content._id,
            editor: function (content) {
                content.data.binary = media._id;
                return content;
            }
        });


        log.info('Media created: %s', JSON.stringify(media, null, 2));
    }
}