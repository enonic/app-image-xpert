var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var imageXpertLib = require('/lib/image-xpert');
var parentPath = './';
var view = resolve(parentPath + 'gallery.page.html');

function handleGet(req) {

    var editMode = req.mode == 'edit';

    var site = portal.getSite();
    var reqContent = portal.getContent();
    var jQueryAssetUrl = portal.assetUrl({path: "js/jquery-2.1.4.min.js"});

    var category = req.params.category ? imageXpertLib.getContentByKey(req.params.category).displayName : "Search";

    var params = {
        context: req,
        site: site,
        reqContent: reqContent,
        mainRegion: reqContent.page.regions["main"],
        editable: editMode,
        jQueryAssetUrl: jQueryAssetUrl,
        selectedCategory: category
    };
    var body = thymeleaf.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
}

exports.get = handleGet;


