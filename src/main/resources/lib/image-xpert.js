var contentLib = require('/lib/xp/content');

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


