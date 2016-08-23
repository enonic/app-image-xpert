var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var imageXpertLib = require('/lib/image-xpert');
var parentPath = './';
var view = resolve(parentPath + 'main.page.html');

function handleGet(req) {

    var editMode = req.mode == 'edit';

    var site = portal.getSite();
    var reqContent = portal.getContent();
    var renameAlbumServiceUrl = portal.serviceUrl({service: "rename-album"});

    var randomImage = imageXpertLib.getRandomImage();
    var backgroundImageUrl = portal.attachmentUrl({
        id: randomImage._id
    });
    var backgroundImageStyle = "background-image: url('" + backgroundImageUrl + "');";

    var params = {
        context: req,
        site: site,
        reqContent: reqContent,
        mainRegion: reqContent.page.regions["main"],
        editable: editMode,
        backgroundImageStyle: backgroundImageStyle,
        renameAlbumServiceUrl: renameAlbumServiceUrl,
        searchPageUrl: portal.serviceUrl({service: "search"}),
        spinnerUrl: portal.assetUrl({path: 'img/spinner.svg'})

    };
    var body = thymeleaf.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
}

exports.get = handleGet;


