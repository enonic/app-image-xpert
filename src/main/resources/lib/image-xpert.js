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

exports.getAlbum = function (albumId) {
    return contentLib.query({
        start: 0,
        count: -1,
        contentTypes: [app.name + ":album"],
        query: "_id='" + albumId + "'"
    }).hits[0];
};

exports.getAlbums = function () {
    return contentLib.query({
        start: 0,
        count: -1,
        contentTypes: [app.name + ":album"],
        sort: "createdTime DESC"
    }).hits.map(this.getAlbumObject.bind(this));
};

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
    var sitePath = portalLib.getSite()._path;
    var query = "_path LIKE '/content" + sitePath + "/*'";
    var total = contentLib.query({
        start: 0,
        count: 0,
        query: query,
        contentTypes: ["media:image"]
    }).total;

    return contentLib.query({
        start: Math.floor(Math.random() * total),
        count: 1,
        query: query,
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

exports.generateImagePageUrl = function (params) {
    var sitePath = portalLib.getSite()._path;
    var params = params && params.imageId ? {
        imageId: params.imageId
    } : undefined;
    return portalLib.pageUrl({
        path: sitePath + "/image",
        params: params
    });
};

exports.generateHomeUrl = function (params) {
    var sitePath = portalLib.getSite()._path;
    var params = params && params.albumId ? {
        albumId: params.albumId
    } : undefined;

    return portalLib.pageUrl({
        path: sitePath,
        params: params
    });
};

exports.publishAlbum = function(albumId) {
    contentLib.publish({
        keys: [albumId],
        sourceBranch: 'draft',
        targetBranch: 'master'
    });
};


exports.getAlbumObject = function (album) {
    var imageUrl;
    var albumImage = this.getAlbumImage(album._path);
    if (albumImage) {
        imageUrl = portalLib.imageUrl({
            id: albumImage._id,
            scale: "square(175)"
        })
    }

    return {
        displayName: album.displayName,
        stackType: "stack-type-" + parseInt((Math.random() * 5) + 1),
        imageUrl: imageUrl,
        albumId: album._id
    };
};

exports.getAlbumByImageId = function(imageId) {

    var albums = this.getAlbums().
        filter(function (album) {
            var result = contentLib.getChildren({
                key: album.albumId,
                contentTypes: ["media:image"]
            });
        
            return result.hits.some(function (image) {
                return image._id == imageId;
            });
        });
    
    if (albums.length > 0) {
        return this.getAlbum(albums[0].albumId);
    }
    
    return null;
    
};