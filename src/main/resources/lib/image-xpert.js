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

    var binaryImagesIds;
    if (params && params.searchQuery) {
        var binaryImageQuery = "ngram('_allText', '" + params.searchQuery + "', 'AND')";
        var binaryImagesIds = contentLib.query({
            start: 0,
            count: 100,
            query: binaryImageQuery,
            contentTypes: ["media:image"]
        }).
            hits.
            map(function (binaryImage) {
                return binaryImage._id;
            });

        if (binaryImagesIds.length == 0) {
            return [];
        }
    }


    var imageQuery;
    if (binaryImagesIds) {
        imageQuery = "data.binary IN ('" + binaryImagesIds.join("','") + "') ";

    } else {
        imageQuery = undefined;
    }

    if (params && params.categoryId) {
        if (imageQuery) {
            imageQuery = imageQuery + " AND ";
        } else {
            imageQuery = "";
        }
        imageQuery = imageQuery + ("data.category = '" + params.categoryId + "'");
    }
    return contentLib.query({
        start: 0,
        count: 10,
        query: imageQuery,
        contentTypes: [app.name + ":image"],
        sort: "createdTime DESC"
    }).hits;

};

exports.getRandomImage = function () {
    var total = contentLib.query({
        start: 0,
        count: 0,
        contentTypes: [app.name + ":image"]
    }).total;

    return contentLib.query({
        start: Math.floor(Math.random() * total),
        count: 1,
        contentTypes: [app.name + ":image"]
    }).hits[0];
};

/******************************************
 * URL generation functions
 *****************************************/

exports.generateUploadPageUrl = function () {
    return portalLib.pageUrl({
        path: "/image-xpert/upload"
    });
};

exports.generateDownloadPageUrl = function (params) {
    var params = params && params.imageId ? {
        image: params.imageId
    } : undefined;
    return portalLib.pageUrl({
        path: "/image-xpert/download",
        params: params
    });
};

exports.generateInfoPageUrl = function (params) {
    return portalLib.pageUrl({
        path: params.imagePath
    });
};

exports.generateGalleryPageUrl = function (params) {
    var params = params && params.categoryId ? {
        category: params.categoryId
    } : undefined;
    return portalLib.pageUrl({
        path: "/image-xpert/gallery",
        params: params
    });
};

exports.generateHomeUrl = function (params) {
    return portalLib.pageUrl({
        path: "/image-xpert"
    });
};

