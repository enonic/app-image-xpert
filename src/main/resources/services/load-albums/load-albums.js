var imageXpertLib = require('/lib/image-xpert');
var portalLib = require('/lib/xp/portal');

function getAlbums(i) {
    return imageXpertLib.getAlbums().
    map(function (album) {
        var imageUrl;
        var albumImage = imageXpertLib.getAlbumImage(album._path);
        if (albumImage) {
            imageUrl = portalLib.imageUrl({
                id: albumImage._id,
                scale: "square(225)"
            })
        }

        return {
            displayName: album.displayName,
            imageUrl: imageUrl,
            albumId: album._id + (i==0 ? '' : '123') // Remove this when there are more albums!!!
        };
    });
}

exports.get = function (req) {
    var albums = [];

    for (var i=0; i<3; i++) {
        albums = albums.concat(getAlbums(i));
    }

    return {
        contentType: "application/json",
        body: {
            data: albums
        }
    }
};
