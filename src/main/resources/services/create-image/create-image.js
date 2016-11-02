var portalLib = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var imageXpertLib = require('/lib/image-xpert');

exports.post = function (req) {
    var publish = "master" == req.branch;
    var albumId = portalLib.getMultipartText('album');

    if (!albumId && !!portalLib.getMultipartText('albumName')) {
        albumId = createNewAlbum(publish);
    }

    var params = {};

    if (albumId) {
        var createdImages = createImages(albumId, publish);

        if (createdImages.length > 0) {
            params.albumId = albumId;
        }
    }
    else {
        log.error('Failed to create an album');
    }

    return {
        redirect: imageXpertLib.generateHomeUrl(params)
    };
};

function createNewAlbum(publish) {
    var sitePath = portalLib.getSite()._path;
    var album = contentLib.create({
        parentPath: sitePath + "/albums",
        displayName: portalLib.getMultipartText('albumName'),
        contentType: app.name + ":album",
        branch: "draft",
        data: {}
    });

    if (publish) {
        contentLib.publish({
            keys: [album._id],
            sourceBranch: 'draft',
            targetBranch: 'master'
        });
    }

    return album._id;
}

function createImages(albumId, publish) {
    var createdImages = [];
    var nbImages = getNumberImages();
    for (var index = 0; index < nbImages; index++) {
        createdImages.push(createImage(albumId, publish, index));
    }
    return createdImages;
}

function getNumberImages() {
    if (portalLib.getMultipartForm().file.constructor === Array) {
        return portalLib.getMultipartForm().file.length;
    }
    else {
        return 1;
    }
}

function createImage(albumId, publish, fileIndex) {
    var part = portalLib.getMultipartItem("file", fileIndex);
    if (part.fileName && part.size > 0) {

        //Retrieves the album
        var album = imageXpertLib.getContentByKey(albumId);
        if (!album || album.type != (app.name + ":album" )) {
            log.error('No album: %s', albumId);
            return null;
        }

        //Creates the image
        var content = contentLib.createMedia({
            name: part.fileName,
            parentPath: album._path,
            mimeType: part.contentType,
            branch: "draft",
            focalX: 0.5,
            focalY: 0.5,
            data: portalLib.getMultipartStream("file", fileIndex)
        });

        //Updates the image with meta data
        var caption = portalLib.getMultipartText("caption");
        var artist = portalLib.getMultipartText("artist");
        var tags = portalLib.getMultipartText("tags");
        contentLib.modify({
            key: content._id,
            branch: "draft",
            editor: function (media) {
                media.data.caption = caption;
                media.data.artist = artist;
                media.data.tags = tags;
                return media;
            }
        });

        if (publish) {
            contentLib.publish({
                keys: [content._id],
                sourceBranch: 'draft',
                targetBranch: 'master'
            });
        }

        return content;
    }
    return null;
}