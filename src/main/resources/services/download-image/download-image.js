var portalLib = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var imageXpertLib = require('/lib/image-xpert');

exports.post = function (req) {

    //portalLib.imageUrl({});
    var redirectUrl = "/admin/tool";

    return {
        redirect: redirectUrl
    };
};