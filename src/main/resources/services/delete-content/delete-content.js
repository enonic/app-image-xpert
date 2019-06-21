var contentLib = require('/lib/xp/content');
var imageXpertLib = require('/lib/image-xpert');
var mustacheLib = require('/lib/mustache');

exports.delete = function (req) {
    var urlParts = req.url.split('/');
    var index = urlParts.indexOf('delete-content');
    var contentId;
    
    if (index == urlParts.length-2) {
        contentId = urlParts[urlParts.length-1];
    }

    if (!contentId) {
        return {
            contentType: "application/json",
            body: {
                message: "Please provide id of content to delete",
                success: false
            }
        }
    }
    
    var content = imageXpertLib.getContentByKey(contentId);
    var album;
    if (content.type == "media:image") {
        album = imageXpertLib.getAlbumByImageId(contentId);
    }

    var result = contentLib.delete({
        key: contentId,
        branch: 'draft'
    });

    contentLib.publish({
        keys: [contentId],
        sourceBranch: 'draft',
        targetBranch: 'master'
    });

    if (result) {
        if (!!album) {
            var view = resolve('../album/album.html');
            var body = mustacheLib.render(view, imageXpertLib.getAlbumObject(album));

            return {
                status: 200,
                contentType: 'text/html',
                body: body
            };
        }
        else {
            return {
                status: 200,
                contentType: 'text/html',
                body: {
                    message: "Successfully deleted album",
                    success: true
                }
            };
        }
    }
    else {

        return {
            status: 500,
            contentType: "application/json",
            body: {
                message: "Failed to delete content",
                success: false
            }
        }
    }
};
