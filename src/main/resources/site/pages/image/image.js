var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var parentPath = './';
var view = resolve(parentPath + 'image.page.html');

function handleGet(req) {

    var editMode = req.mode == 'edit';

    var site = portal.getSite();
    var reqContent = portal.getContent();

    var params = {
        context: req,
        site: site,
        reqContent: reqContent,
        mainRegion: reqContent.page.regions["main"],
        editable: editMode,
        updateMetaServiceUrl: portal.serviceUrl({service: "update-meta"})
    };
    var body = thymeleaf.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
}

exports.get = handleGet;


