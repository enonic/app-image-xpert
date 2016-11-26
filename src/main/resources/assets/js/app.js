(function() {
    'use strict';

    var app = {
        isLoading: true,
        spinner: document.querySelector('.loader'),
        container: document.querySelector('.main'),
        albumTemplate: document.querySelector('.album-template'),
        addDialog: document.querySelector('.dialog-container'),
        albums: {}
    };

    // Some static info here
    var initialAlbumInfo = {
        albumId: 'offline',
        displayName: 'ImageXPert Album',
        imageUrl: urlConfig.assetUrl + "logo.png"
    };

    app.showAlbum = function(albumInfo) {
        let album = app.albums[albumInfo.albumId];
        if (!album) {
            // Album is not added to the page yet
            album = app.albumTemplate.cloneNode(true);

            album.classList.remove('album-template');
            album.removeAttribute('hidden');
        }
        if (albumInfo.imageUrl) {
            let albumLink = album.querySelector('.album-link');
            albumLink.removeAttribute('hidden');
            albumLink.onclick = openAlbum.bind(this, albumInfo.albumId);
            album.querySelector('.image-stack').classList.add("stack-type-" + parseInt((Math.random() * 5) + 1));
            album.querySelector('.album-image').setAttribute("src", albumInfo.imageUrl);

            let albumNameSpan = album.querySelector('.album-name-span');
            let albumNameInput = album.querySelector('.album-name-input');

            albumNameSpan.classList.add("stack-type-" + parseInt((Math.random() * 5) + 1));
            albumNameSpan.id = `album-name-span-${albumInfo.albumId}`;
            albumNameSpan.innerHTML = albumInfo.displayName;

            albumNameInput.value = albumInfo.displayName;
            albumNameInput.id = `album-name-input-${albumInfo.albumId}`;

            albumNameSpan.onclick = editAlbumName.bind(this, albumNameSpan, albumNameInput, albumInfo.albumId);
        }
        else {
            album.querySelector('.empty-album').removeAttribute('hidden');
        }

        if (!app.albums[albumInfo.albumId]) {
            app.container.appendChild(album);

            app.albums[albumInfo.albumId] = album;
        }
    };
    
    app.loadAlbums = function(url) {

        // Fetch the latest data.
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = JSON.parse(request.response);
                    var results = response.data;
                    app.showAlbums(results);

                    if (app.isLoading) {
                        app.spinner.setAttribute('hidden', true);
                        app.container.removeAttribute('hidden');
                        app.isLoading = false;
                    }
                }
            } else {
                // Show default album info until the actual data is available

                //app.showAlbum(initialAlbumInfo);
            }
        };
        request.open('GET', url);
        request.send();

    };

    app.showAlbums = function(albums) {
        albums.forEach(function(album) {
            app.showAlbum(album);
        });
    };

    if (!!urlConfig.loadAlbumsUrl) {
        app.loadAlbums(urlConfig.loadAlbumsUrl);
    }
    else {
        app.showAlbum(initialAlbumInfo);
    }
})();
