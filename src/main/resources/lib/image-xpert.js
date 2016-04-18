var contentLib = require('/lib/xp/content');
var portalLib = require('/lib/xp/portal');


/******************************************
 * Retrieval functions
 *****************************************/
exports.getContentByKey = function (key) {
    return contentLib.get({
        key: key
    });
};

exports.getCategories = function () {
    return contentLib.query({
        start: 0,
        count: -1,
        contentTypes: [app.name + ":category"],
        sort: "displayName ASC"
    }).hits;
}

exports.getImages = function (params) {
    var query = params && params.categoryId ? ("data.category = '" + params.categoryId + "'") : undefined;
    log.info("query: %s", query);
    return contentLib.query({
        start: 0,
        count: -1,
        query: query,
        contentTypes: [app.name + ":image"],
        sort: "createdTime DESC"
    }).hits;
};

/******************************************
 * URL generation functions
 *****************************************/

exports.generateUploadUrl = function (params) {
    return portalLib.pageUrl({
        path: "/image-xpert/upload"
    });
}

exports.generateGalleryUrl = function (params) {
    var params = params && params.categoryId ? {
        category: params.categoryId
    } : undefined;
    return portalLib.pageUrl({
        path: "/image-xpert/gallery",
        params: params
    });
};



