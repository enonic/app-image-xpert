var portalLib = require('/lib/xp/portal');
var assetLib = require('/lib/enonic/asset');
var mustache = require('/lib/mustache');

exports.get = function(req) {
    var sitePath = portalLib.getSite()._path;
    var params = {
        siteUrl : portalLib.pageUrl({path: sitePath}),
        assetUrl : assetLib.assetUrl({path: ''}),
        appVersion: app.version
    };

    var res = mustache.render(resolve('service-worker.js'), params);

    return {
        body: res,
        contentType: 'application/javascript',
        headers: {
            'Service-Worker-Allowed': params.siteUrl
        }
    };
};
