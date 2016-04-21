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

    //Retrieves the binary images corresponding to the search query
    var binaryImagesIds;
    if (params && params.searchQuery) {
        var binaryImageQuery = "ngram('_allText', '" + params.searchQuery + "', 'AND')";
        var binaryImagesIds = contentLib.query({
            start: 0,
            count: 10,
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

    //If this is a search by query
    var imageQuery;
    if (binaryImagesIds) {
        // Searches for the image contents containing the image binaries found
        imageQuery = "data.binary IN ('" + binaryImagesIds.join("','") + "') ";

    } else if (params && params.categoryId) {
        // Else if this is a search by category, search by category
        imageQuery = "data.category = '" + params.categoryId + "'";
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

