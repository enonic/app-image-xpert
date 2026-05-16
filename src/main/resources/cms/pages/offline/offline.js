var assetLib = require('/lib/enonic/asset');
var view = resolve('offline.page.html');
var mustacheLib = require('/lib/mustache');

function handleGet(req) {
    var version = req.params.version || 'full';

    var params = {
        assetUrl: assetLib.assetUrl({path: ''}),
        fullVersion: (version == 'full')
    };
    
    var body = mustacheLib.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
}

exports.get = handleGet;


