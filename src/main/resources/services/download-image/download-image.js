var portalLib = require('/lib/xp/portal');

exports.post = function (req) {
    var imageUrl = portalLib.imageUrl({
        id: req.params.binary,
        scale: 'block(1024,768)'
    });
    return {
        redirect: imageUrl
    };
};