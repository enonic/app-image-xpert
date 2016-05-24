var portalLib = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var imageXpertLib = require('/lib/image-xpert');

exports.post = function (req) {
    var createdImages = createImages();
    var redirectUrl = imageXpertLib.generateGalleryPageUrl({
        albumId: createdImages.length > 0 ? createdImages[0].data.album : undefined
    });

    return {
        redirect: redirectUrl + "&upload=true"
    };
};

function createImages() {
    var createdImages = [];
    var nbImages = portalLib.getMultipartForm().file.length;
    for (var index = 0; index < nbImages; index++) {
        createdImages.push(createImage(index));
    }
    return createdImages;
}

function createImage(fileIndex) {
    var part = portalLib.getMultipartItem("file", fileIndex);
    if (part.fileName && part.size > 0) {

        //Retrieves the album
        var albumId = portalLib.getMultipartText('album');
        var album = imageXpertLib.getContentByKey(albumId);
        if (!album || album.type != (app.name + ":album" )) {
            log.error('No album: %s', albumId);
            return null;
        }

        //Creates the Image content
        var content = contentLib.create({
            parentPath: imageXpertLib.generateCurrentImageFolderPath(album._path),
            displayName: part.fileName,
            contentType: app.name + ":image",
            branch: "draft",
            data: {
                album: album._id
            }
        });

        //Creates the Image media
        var media = contentLib.createMedia({
            name: part.fileName,
            parentPath: content._path,
            mimeType: part.contentType,
            branch: "draft",
            focalX: 0.5,
            focalY: 0.5,
            data: portalLib.getMultipartStream("file", fileIndex)
        });

        //Updates the Image media
        var caption = portalLib.getMultipartText("caption");
        var artist = portalLib.getMultipartText("artist");
        var tags = portalLib.getMultipartText("tags");
        contentLib.modify({
            key: media._id,
            editor: function (media) {
                media.data.caption = caption;
                media.data.artist = artist;
                media.data.tags = tags;
                return media;
            }
        });


        //Links the Image content to the Image media
        content = contentLib.modify({
            key: content._id,
            editor: function (content) {
                content.data.binary = media._id;
                return content;
            }
        });

        return content;
    }
    return null;
}