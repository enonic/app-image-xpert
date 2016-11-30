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
        imageUrl: "../img/logo.png"
    };

    document.getElementById('butSearch').addEventListener('click', function() {
        document.getElementById('search-field').classList.toggle("is-focused");
    });

    document.getElementById('butAdd').addEventListener('click', function() {
        // Open/show the add new city dialog
        app.toggleAddDialog(true);
    });

    document.getElementById('butAddAlbum').addEventListener('click', function() {
        return app.openFileUploadDialog();
    });

    document.getElementById('butAddCancel').addEventListener('click', function() {
        // Close the add new city dialog
        app.toggleAddDialog(false);
    });


    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/


    app.getNewAlbumName = function () {
        var albumName = '',
            albumNameTextBox = document.querySelector('input[name="albumName"]');

        if (albumNameTextBox) {
            albumName = albumNameTextBox.value.trim();
        }

        return albumName;
    };

    app.openFileUploadDialog = function (isNewAlbum) {
        //app.addDialog.classList.remove("select-files");
        app.toggleAddDialog(false);
        var fileUploadEl = document.querySelector('input[name="file"]');
        if (isNewAlbum) {
            //app.addDialog.classList.remove("select-files");
            fileUploadEl.click();
            return false;
        }
        var albumName = getNewAlbumName();
        if (isChrome()) {
            document.body.onfocus = app.toggleAddDialog.bind(this, false);
        }

        if (fileUploadEl) {
            if (isChrome()) {
                //app.addDialog.classList.add("select-files");
                setNewAlbumName(albumName);
            }
            else {
                app.toggleAddDialog(false);
            }
            fileUploadEl.click();
        }
        return false;
    };

    // Toggles the visibility of the add new city dialog.
    app.toggleAddDialog = function(visible) {
        if (visible) {
            app.addDialog.classList.add('dialog-container--visible');
            app.addDialog.querySelector('input[name="new-album-name"]').focus();
        } else {
            app.addDialog.classList.remove('dialog-container--visible');
        }
    };
/*
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('service-worker.js')
            .then(function(reg) {
                console.log('Service Worker registered with scope '  + reg.scope);
            }, function() {
                console.log('Service Worker registration failure.');
            });
    }
*/
})();
