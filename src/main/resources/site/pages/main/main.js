var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var view = resolve('./main.page.html');

function handleGet(req) {
/*
    var randomImage = imageXpertLib.getRandomImage();
    var backgroundImageUrl = portal.attachmentUrl({
        id: randomImage._id
    });
    var backgroundImageStyle = "background-image: url('" + backgroundImageUrl + "');";
    var albumId;

    if (req.params.albumId && imageXpertLib.getContentByKey(req.params.albumId)) {
        albumId = req.params.albumId;
    }
  */
    var params = {
        createImageUrl: portal.serviceUrl({service: "create-image"}),
        renameAlbumUrl: portal.serviceUrl({service: "rename-album"}),
        searchPageUrl: portal.serviceUrl({service: "search"}),
        loadAlbumsUrl: portal.serviceUrl({service: "load-albums"}),
        assetUrl: portal.assetUrl('')
        /*context: req,
        site: site,
        reqContent: reqContent,
        mainRegion: reqContent.page.regions["main"],
        backgroundImageStyle: backgroundImageStyle,
        renameAlbumServiceUrl: renameAlbumServiceUrl,
        searchPageUrl: portal.serviceUrl({service: "search"}),
        spinnerUrl: portal.assetUrl({path: 'img/spinner.svg'}),
        albumId: albumId*/
    };
    var body = thymeleaf.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
}

exports.get = handleGet;


