var portalLib = require('/lib/xp/portal');
var mustache = require('/lib/xp/mustache');

exports.get = function(req) {
    var sitePath = portalLib.getSite()._path;
    var params = {
        siteUrl : portalLib.pageUrl({path: sitePath}),
        assetUrl : portalLib.assetUrl('')
    };
    var res = mustache.render(resolve('manifest.json'), params);

    return {
        body: res,
        contentType: 'application/json'
    };
};
