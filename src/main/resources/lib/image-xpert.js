var contentLib = require('/lib/xp/content');

exports.getImageBinaryIds = function () {
    var imageBinaries = contentLib.query({
        start: 0,
        count: -1,
        contentTypes: ["media:image"],
        sort: "displayName ASC"
    }).hits;
    return imageBinaries.map(function (imageBinary) {
        return imageBinary._id;
    });
};

exports.getCategories = function () {
    return contentLib.query({
        start: 0,
        count: -1,
        contentTypes: [app.name + ":category"],
        sort: "displayName ASC"
    }).hits;
};

exports.getCategoryByName = function (categoryName) {
    return contentLib.get({
        key: "/image-xpert/categories/" + categoryName,
        branch: "draft"
    });
};