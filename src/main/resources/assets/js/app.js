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
    
    document.getElementById('butRefresh').addEventListener('click', function() {
        // Refresh all albums
    });

    document.getElementById('butAdd').addEventListener('click', function() {
        // Open/show the add new city dialog
        app.toggleAddDialog(true);
    });

    document.getElementById('butAddAlbum').addEventListener('click', function() {
        // Add the new album
        //app.toggleAddDialog(false);
        return app.openFileUploadDialog();/*
        var select = document.getElementById('selectCityToAdd');
        var selected = select.options[select.selectedIndex];
        var key = selected.value;
        var label = selected.textContent;
        if (!app.selectedCities) {
            app.selectedCities = [];
        }
        app.getForecast(key, label);
        app.selectedCities.push({key: key, label: label});
        app.saveSelectedCities();
        app.toggleAddDialog(false);*/
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
        debugger;
        var fileUploadEl = document.querySelector('input[name="file"]');
        if (isNewAlbum) {
            fileUploadEl.click();
            return false;
        }
        var albumName = getNewAlbumName();
        if (isChrome()) {
            document.body.onfocus = app.toggleAddDialog.bind(this, false);
        }

        if (fileUploadEl) {
            if (isChrome()) {
                app.addDialog.classList.add("select-files");
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
