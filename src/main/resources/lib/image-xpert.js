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
        var binaryImageQuery = "ngram('_allText', '" + params.searchQuery + "', 'OR')";
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
    var imageSort;
    if (binaryImagesIds) {
        // Searches and return the image contents containing the image binaries found
        return binaryImagesIds.map(function (binaryImageId) {
            var imagesFound = contentLib.query({
                start: 0,
                count: 1,
                query: "data.binary = '" + binaryImageId + "'",
                contentTypes: [app.name + ":image"],
                sort: imageSort
            }).hits;
            return imagesFound.length > 0 ? imagesFound[0] : undefined;
        }).filter(function (image) {
            return !!image;
        });
    }

    //Else if this is a search by category
    var imageQuery;
    if (params && params.categoryId) {
        // Searches by category
        imageQuery = "data.category = '" + params.categoryId + "'";
        imageSort = "createdTime DESC";
    }

    //Returns the ten last created images
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
 * URL and path generation functions
 *****************************************/

exports.generateDownloadPageUrl = function (params) {
    var sitePath = portalLib.getSite()._path;
    var params = params && params.imageId ? {
        image: params.imageId
    } : undefined;
    return portalLib.pageUrl({
        path: sitePath + "/download",
        params: params
    });
};

exports.generateInfoPageUrl = function (params) {
    var sitePath = portalLib.getSite()._path;
    return portalLib.pageUrl({
        path: params.imagePath
    });
};

exports.generateGalleryPageUrl = function (params) {
    var sitePath = portalLib.getSite()._path;
    var params = params && params.categoryId ? {
        category: params.categoryId
    } : undefined;
    return portalLib.pageUrl({
        path: sitePath + "/gallery",
        params: params
    });
};

exports.generateHomeUrl = function (params) {
    var sitePath = portalLib.getSite()._path;
    return portalLib.pageUrl({
        path: sitePath
    });
};

exports.generateImageFolderPath = function () {
    return portalLib.getSite()._path + "/images";
};

