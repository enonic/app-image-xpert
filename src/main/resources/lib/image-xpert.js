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


exports.getImagesByCategoryId = function () {
    //TODO
    return [];
};

exports.getImagesBySearch = function () {
    //TODO
    //Newest image on top
    return [];
};

exports.getImagesByCategoryIdAndSearch = function () {
    //TODO
    //Newest image on top
    return [];
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



