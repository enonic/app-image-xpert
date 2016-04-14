var contentLib = require('/lib/xp/content');

exports.getImages = function () {
    return contentLib.query({
        start: 0,
        count: -1,
        contentTypes: [app.name + ":image"],
        sort: "displayName ASC"
    }).hits;
};

exports.getCategories = function () {
    return contentLib.query({
        start: 0,
        count: -1,
        contentTypes: [app.name + ":category"],
        sort: "displayName ASC"
    }).hits;
};

/*function toArray(object) {
 if (!object) {
 return [];
 }
 if (object.constructor === Array) {
 return object;
 }
 return [object];
 }*/