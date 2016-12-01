(function(global) {
    'use strict';

    var ixp = {

        // public methods

        createNewAlbum: function () {
            var http = new XMLHttpRequest();
            var form = document.getElementById("new-album-form");
            var formData = new FormData(form);
            http.open("POST", form.action, true);

            http.onreadystatechange = function() {
                if (http.readyState == 4 && http.status == 200 && http.responseText !== "") {
                    appendNewAlbum(http.responseText);
                    showNotification("New album successfully created");
                }
            };
            http.send(formData);
        },

        editAlbumName: function (albumId) {
            var spanEl = document.querySelector('#album-name-span-' + albumId),
                inputEl = document.querySelector('#album-name-input-' + albumId);

            inputEl.onCloseEditMode = closeEditMode.bind(this, spanEl, inputEl, albumId);

            inputEl.addEventListener("click", onAlbumNameClick);
            inputEl.addEventListener("keyup", inputEl.onCloseEditMode);
            document.addEventListener("click", inputEl.onCloseEditMode);

            inputEl.value = spanEl.innerText;

            spanEl.classList.add("invisible");
            inputEl.classList.add("visible");

            inputEl.focus();
        },

        openAlbum: function (albumId) {
            if (!urlConfig.searchPageUrl || !albumId) {
                return false;
            }
            //    toggleNoResultsMessage(false);
            //    toggleSpinner(true);
            setAlbumId(albumId);

            doSearchAndShowResults("albumId=" + albumId, getAlbumTitle(albumId));

            return false;
        }
    };

    var addDialog, albumPanel, imagePanel, menuIcon, backButton, searchInput;

    function getNewAlbumName() {
        var albumName = '',
            albumNameTextBox = document.querySelector('input[name="albumName"]');

        if (albumNameTextBox) {
            albumName = albumNameTextBox.value.trim();
        }

        return albumName;
    }

    function openFileUploadDialog (isNewAlbum) {
        //app.addDialog.classList.remove("select-files");
        toggleAddDialog(false);
        var fileUploadEl = document.querySelector('input[name="file"]');
        if (isNewAlbum) {
            fileUploadEl.click();
            return false;
        }
        var albumName = getNewAlbumName();
        if (isChrome()) {
            document.body.onfocus = toggleAddDialog.bind(this, false);
        }

        if (fileUploadEl) {
            if (isChrome()) {
                setNewAlbumName(albumName);
            }
            else {
                toggleAddDialog(false);
            }
            fileUploadEl.click();
        }
        return false;
    }

    // Toggles the visibility of the add new city dialog.
    function toggleAddDialog (visible) {
        if (visible) {
            document.getElementById('dialog-input').value = '';
            addDialog.classList.add('dialog-container--visible');
            addDialog.querySelector('input[name="new-album-name"]').focus();
        } else {
            addDialog.classList.remove('dialog-container--visible');
        }
    }


    function initPage() {
        document.querySelector('.main-container').classList.remove("init");
    }

    function isChrome() {
        return navigator.userAgent.search("Chrome") > -1;
    }

    function getNewAlbumName() {
        let albumName = '',
            albumNameTextBox = document.querySelector('input[name="new-album-name"]');

        if (albumNameTextBox) {
            albumName = albumNameTextBox.value.trim();
        }

        return albumName;
    }

    function setNewAlbumName(albumName) {
        let newAlbumSpanEl = document.querySelector('input[name="albumName"]');
        newAlbumSpanEl.value = albumName;
    }

    function validateForm() {
        let createButton = document.getElementById('butAddAlbum');
        createButton["disabled"] = (getNewAlbumName().length == 0);
    }

    function closeEditMode(spanEl, inputEl, id, e) {
        if (e.target == spanEl) {
            return;
        }

        if (!!e.keyCode && !(e.keyCode == 13 || e.keyCode == 27)) {
            return;
        }

        inputEl.removeEventListener("click", onAlbumNameClick);
        inputEl.removeEventListener("keyup", inputEl.onCloseEditMode);
        document.removeEventListener("click", inputEl.onCloseEditMode);

        delete inputEl.onCloseEditMode;

        if (inputEl.value.trim() !== "" && (!e.keyCode || e.keyCode !== 27)) {
            renameAlbum(id, inputEl, spanEl);
        }
    }

    function onAlbumNameClick(e) {
        if (e) {
            e.stopPropagation();
        }
        else {
            window.event.cancelBubble = true;
        }
    }

    function renameAlbum(id, inputEl, spanEl) {
        var albumName = inputEl.value.trim();

        if (!urlConfig.renameAlbumServiceUrl || urlConfig.renameAlbumServiceUrl == "" || albumName == "" || spanEl.innerText == albumName) {
            spanEl.classList.remove("invisible");
            inputEl.classList.remove("visible");
            return;
        }

        var http = new XMLHttpRequest();
        http.open("POST", urlConfig.renameAlbumServiceUrl, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200 && http.responseText !== "") {
                var responseObj = JSON.parse(http.responseText);
                if (responseObj.name !== "" && responseObj.name === albumName) {
                    spanEl.innerText = responseObj.name;
                    spanEl.classList.remove("invisible");
                    inputEl.classList.remove("visible");
                }
            }
        };
        http.send("id=" + id + "&name=" + albumName);
    }

    function htmlToElement(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function appendNewAlbum(albumHtml) {
        var newAlbumDiv = htmlToElement(albumHtml);
        var container = document.getElementById("browse-albums");

        container.firstChild ? container.insertBefore(newAlbumDiv, container.firstChild) : container.appendChild(newAlbumDiv);
    }

    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    function toggleSpinner(visible) {
        var mainContainer = document.querySelector(".main-container");
        if (visible) {
            mainContainer.style.opacity = 0.2;
        }
        document.getElementById('ixp-spinner').classList.toggle("visible", visible);
        if (!visible) {
            mainContainer.style.opacity = 1;
        }
    }

    function initSearch(e) {
        var searchValue = e.target.value.trim();
        //toggleSpinner(true);

        doSearch(searchValue);
    }

    function hideAlbums() {
        //document.querySelector(".main-container").classList.add("search-results");
        if (!albumPanel.classList.contains("slide-out")) {
            albumPanel.classList.add("slide-out");
        }
        else {
            togglePanel(albumPanel);
        }
        menuIcon.style.display = "none";
        backButton.style.display = "block";
    }

    function showAlbums() {
        togglePanel(imagePanel);
        togglePanel(albumPanel);
        setAlbumId('');
        showAlbumTitle('');
        menuIcon.style.display = "block";
        backButton.style.display = "none";
    }

    function clearSearchResults() {
        showSearchResults('');
    }

    function showSearchResults(responseHTML) {
        imagePanel.innerHTML = responseHTML;

        if (!isPanelVisible(imagePanel)) {
            togglePanel(imagePanel);
        }
    }

    function toggleNoResultsMessage(visible) {
        document.getElementById('search-results-span').style.display = visible ? "block" : "none";
    }

    function doSearch(keyWords) {
        let searchString = keyWords ? "search=" + keyWords : "",
            albumId = getAlbumId();
        //toggleNoResultsMessage(false);
        //clearSearchResults('');

        if (!urlConfig.searchPageUrl || (!albumId && keyWords.trim() == "")) {
            //toggleSpinner(false);
            showAlbums();

            return;
        }

        if (albumId) {
            // Search in current album
            searchString += keyWords ? "&" : "";
            searchString += "albumId=" + albumId;
        }
        doSearchAndShowResults(searchString, keyWords ? '"' + keyWords + '"' : getAlbumTitle(albumId));
    }

    function getAlbumId() {
        return document.getElementById("albumId").value;
    }

    function setAlbumId(albumId) {
        document.getElementById("albumId").value = albumId;
    }

    function getAlbumTitle(albumId) {
        return document.getElementById('album-name-span-' + albumId).innerText;
    }

    ixp.openAlbum = function (albumId) {

        if (!urlConfig.searchPageUrl || !albumId) {
            return false;
        }
    //    toggleNoResultsMessage(false);
    //    toggleSpinner(true);
        setAlbumId(albumId);

        doSearchAndShowResults("albumId=" + albumId, getAlbumTitle(albumId));

        return false;
    };

    function onResponseReceived(responseText, albumTitle) {
        //hideAlbums();
        if (albumTitle) {
            showAlbumTitle(albumTitle);
        }
        showSearchResults(responseText);
    }

    function doSearchAndShowResults(searchString, albumTitle) {
        var url = urlConfig.searchPageUrl + "?" + searchString;

        if (isPanelVisible(albumPanel)) {
            hideAlbums();
            imagePanel.innerHTML = "";
        }
        
        if ('caches' in window) {
            /*
             * Check if the service worker has already cached results of this search.
             * If it did, then display the cached data while the app fetches the latest.
             */
            caches.match(url).then(function(response) {
                if (response) {
                    response.text().then(function (responseText) {
                        onResponseReceived(responseText, albumTitle);
                    });
                }
            });
        }

        //setTimeout(function() {

            var http = new XMLHttpRequest();
            http.open("GET", url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            http.onreadystatechange = function () {
                if (http.readyState == 4) {
                    if (http.status == 200 && http.responseText !== "") {
                        onResponseReceived(http.responseText, albumTitle);
                        //initPage();
                    }
                    //toggleSpinner(false);
                }
            };
            http.send();
        //}, 500);
    }

    function showAlbumTitle(title) {
        document.getElementById("header_title").innerText = "Image XPert " + (title ? " / " + title : "");
    }

    function showNotification(message) {
        var snackbarContainer = document.getElementById("notification_snackbar");
        var data = {
                message: message,
                timeout: 5000
            };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }

    function addSearchEventListeners() {
        if (searchInput) {
            searchInput.addEventListener("keyup", debounce(initSearch.bind(this), 500));
            searchInput.addEventListener("keydown", onSearchKeyPressed);
        }
    }

    function clearSearchField() {
        searchInput.value = '';
        searchInput.blur();
        document.getElementById("search-field").classList.remove("is-dirty");
    }

    function onSearchKeyPressed(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (e.keyCode == 27) {
            clearSearchField();
        }
    }
    
    function addEventHandling() {

        addSearchEventListeners();
        
        document.getElementById('butAdd').addEventListener('click', function () {
            // Open/show the add new city dialog
            toggleAddDialog(true);
        });

        document.getElementById('butAddAlbum').addEventListener('click', function () {
            return openFileUploadDialog();
        });

        document.getElementById('butAddCancel').addEventListener('click', function () {
            // Close the add new city dialog
            toggleAddDialog(false);
        });

        document.getElementById('dialog-input').addEventListener('keyup', validateForm);

        backButton.addEventListener('click', function () {
            showAlbums();
            clearSearchField();
        });
    }

    function togglePanel(panel) {
        panel.classList.toggle("slide-in");
        if (panel.classList.contains("slide-in")) {
            panel.scrollTop = 0;
        }
    }

    function isPanelVisible(panel) {
        return panel.classList.length == 0 || panel.classList.contains("slide-in");
    }

    function init() {

        addDialog = document.querySelector('.dialog-container');
        albumPanel = document.getElementById('browse-albums');
        imagePanel = document.getElementById('browse-images');
        menuIcon = document.getElementById('menu-icon');
        backButton = document.getElementById('back-button');
        searchInput = document.getElementById('search-input');

        addEventHandling();
        
        global.ixp = ixp;
    }

    window.onload = init;

})(this);
