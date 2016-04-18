var contentLib = require('/lib/xp/content');
var portalLib = require('/lib/xp/portal');

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
        sort: "displayName ASC"
    }).hits;
};


exports.generateGalleryUrl = function (params) {

    var params = params && params.categoryId ? {
        category: params.categoryId
    } : undefined;
    return portalLib.pageUrl({
        path: "/image-xpert/gallery",
        params: params
    });
};



