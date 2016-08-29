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

exports.getAlbums = function () {
    return contentLib.query({
        start: 0,
        count: -1,
        contentTypes: [app.name + ":album"],
        sort: "createdTime DESC"
    }).hits;
}

exports.getImages = function (params) {
    var query, sort;

    //If this is a search by query  
    if (params && params.albumId) {
        //Else if it is a search by album
        var album = exports.getContentByKey(params.albumId);
        query = "_path LIKE '/content" + album._path + "/*'";
        sort = "createdTime DESC";
    } else {
        var sitePath = portalLib.getSite()._path;
        query = "_path LIKE '/content" + sitePath + "/*'";
    }

    if (params && params.searchQuery) {
        query += " AND ngram('_allText', '" + params.searchQuery + "', 'OR')";
    }

    //Returns the hundred first images
    return contentLib.query({
        start: 0,
        count: portalLib.getSiteConfig().searchResultMax,
        query: query,
        contentTypes: ["media:image"],
        sort: sort
    }).hits;

};

exports.getRandomImage = function () {
    var total = contentLib.query({
        start: 0,
        count: 0,
        contentTypes: ["media:image"]
    }).total;

    return contentLib.query({
        start: Math.floor(Math.random() * total),
        count: 1,
        contentTypes: ["media:image"]
    }).hits[0];
};

exports.getAlbumImage = function (albumPath) {
    return contentLib.query({
        start: 0,
        count: 1,
        contentTypes: ["media:image"],
        query: "_path LIKE '/content" + albumPath + "/*'",
        sort: "createdTime DESC"
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
    var params = params && params.albumId ? {
        album: params.albumId
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

