var contentLib = require('/lib/xp/content');
var imageXpertLib = require('/lib/image-xpert');

exports.post = function (req) {
    var result = contentLib.modify({
        key: req.params.id,
        editor: function (album) {
            album.displayName = req.params.name;
            return album;
        }
    });

    if (result) {
        imageXpertLib.publishAlbum(req.params.id);
    }

    return {
        contentType: "application/json",
        body: {
            id: req.params.id,
            name: result ? result.displayName : ""
        }
    }
};
