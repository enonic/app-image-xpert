var portal = require('/lib/xp/portal');
var view = resolve('offline.page.html');
var mustacheLib = require('/lib/mustache');

function handleGet(req) {
    var version = req.params.version || 'full';

    var params = {
        assetUrl: portal.assetUrl(''),
        fullVersion: (version == 'full')
    };
    
    var body = mustacheLib.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
}

exports.get = handleGet;


