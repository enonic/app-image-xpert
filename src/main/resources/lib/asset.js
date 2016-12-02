var ioLib = require('/lib/xp/io');

exports.get = function(req) {
    var pathArr = req.path.split('/');
    var fileName = pathArr[pathArr.length - 1];
    var fileExt = fileName.split('.')[1].toLowerCase();
    var contentType, folder = fileExt;

    log.info(fileName);
    log.info(fileExt);

    switch (fileExt) {
        case 'js':
            contentType = 'application/javascript';
            break;
        case 'css':
            contentType = 'text/css';
            break;
        case 'jpg':
            contentType = 'image/jpeg';
            folder = 'img';
            break;
        case 'png':
            contentType = 'image/png';
            folder = 'img';
            break;
        case 'svg':
            contentType = 'image/svg+xml';
            folder = 'img';
            break;
    }

    var res = ioLib.getResource('/assets/' + folder + '/' + fileName).getStream();

    return {
        body: res,
        contentType: contentType
    }
};
