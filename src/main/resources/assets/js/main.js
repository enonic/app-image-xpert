(function(global) {
    'use strict';

    var ixp = {

        // public methods

        createNewAlbum: function () {
            toggleSpinner(true);
            var http = new XMLHttpRequest();
            var form = document.getElementById("new-album-form");
            var formData = new FormData(form);
            let albumId = getAlbumId();
            http.open("POST", form.action, true);

            http.onreadystatechange = function() {
                if (http.readyState == 4) {
                    setAlbumNameInUploadForm();
                    if (http.status == 200) {
                        if (!!albumId) {
                            appendOrReplaceAlbum(http.responseText, albumId);
                            showNotification("Successfully uploaded image(s) into the album");

                            ixp.openAlbum(albumId);
                        }
                        else {
                            if (http.responseText !== "") {
                                appendOrReplaceAlbum(http.responseText);
                                showNotification("New album successfully created");
                            }
                            else {
                                showNotification("Failed to create an album");
                            }
                        }

                        toggleSpinner(false);
                    }
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

        openImage: function(url) {
            if (isDeleteMode()) {
                return;
            }
            window.open(url);
        },

        openAlbum: function (albumId) {
            if (isDeleteMode()) {
                return;
            }
            albumId = albumId || getAlbumId();
            if (!urlConfig.searchPageUrl || !albumId) {
                return false;
            }
            toggleSpinner(true);
            setAlbumId(albumId);

            document.querySelector("header").classList.add("album");
            doSearchAndShowResults("albumId=" + albumId, getAlbumTitle(albumId));

            return false;
        },

        toggleSearch: function() {
            let searchField = document.getElementById("search-field"),
                activateSearch = !searchField.classList.contains("is-focused");
            
            if (!searchField.classList.contains("is-dirty")) {
                document.querySelector("header").classList.toggle("search", activateSearch);
            }
        },
        
        deleteImage: function(e, imageId, imageName) {
            e.preventDefault();
            e.stopPropagation();

            document.getElementById('deleteDialogText').innerHTML = 'Delete image "<b><i>' + imageName + '</i></b>"?';
            document.getElementById('butDeleteOk').onclick = function() {
                toggleDialog(deleteDialog, false);
                sendDeleteRequest(imageId, imageName, onImageDeleted);
            };
            document.querySelector("main").classList.remove('delete');
            toggleDialog(deleteDialog, true);
        },

        deleteAlbum: function(e, albumId, albumName) {
            e.preventDefault();
            e.stopPropagation();

            document.getElementById('deleteDialogText').innerHTML = 'This will delete album "<b><i>' + albumName + '</i></b>" and all of its images?';
            document.getElementById('butDeleteOk').onclick = function() {
                toggleDialog(deleteDialog, false);
                sendDeleteRequest(albumId, albumName, onAlbumDeleted);
            };
            document.querySelector("main").classList.remove('delete');
            toggleDialog(deleteDialog, true);
        }
    };

    var deleteDialog, newAlbumDialog, albumPanel, imagePanel, menuIcon, backButton, searchInput, spinner;

    function sendRequestUpdate(url) {
        let http = new XMLHttpRequest();
        http.open("GET", (url || "") + "?update=true", true);
        http.send();
    }

    function onImageDeleted(imageId, albumHtml) {
        let albumId = getAlbumId();
        appendOrReplaceAlbum(albumHtml, albumId);
        ixp.openAlbum(albumId);
    }

    function onAlbumDeleted(albumId) {
        deleteAlbumFromMainPage(albumId);
    }
    
    function sendDeleteRequest(contentId, contentName, callbackFn) {
        if (!urlConfig.deleteServiceUrl || !contentId) {
            return;
        }

        var http = new XMLHttpRequest();
        http.open("DELETE", urlConfig.deleteServiceUrl + "/" + contentId, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.responseText !== "") {
                if (http.status == 200) {
                    callbackFn.call(this, contentId, http.responseText);
                    showNotification('Successfully deleted "' + contentName + '"');
                }
                else if (http.status == 500)  {
                    var responseObj = JSON.parse(http.responseText);
                    showNotification(responseObj.message);
                }
            }
        };
        http.send();
    }

    function getNewAlbumName() {
        var albumName = '',
            albumNameTextBox = document.querySelector('input[name="new-album-name"]');

        if (albumNameTextBox) {
            albumName = albumNameTextBox.value.trim();
        }

        return albumName;
    }

    function openFileUploadDialog () {
        var fileUploadEl = document.querySelector('input[name="file"]');

        if (!!fileUploadEl) {
            fileUploadEl.click();
        }
        return false;
    }

    function isClickInsideDialog(e, dialog) {
        return e.clientX > dialog.offsetLeft && e.clientX < (dialog.offsetLeft + dialog.offsetWidth) &&
               e.clientY > dialog.offsetTop && e.clientY < (dialog.offsetTop + dialog.offsetHeight);
    }

    function toggleDialog(dialog, visible) {
        if (visible) {
            dialog.showModal();
            if (!document.body.onclick) {
                setTimeout(function() {
                    dialog.onclick = function (e) {
                        if (!isClickInsideDialog(e, dialog)) {
                            toggleDialog(dialog, false);
                        }
                    };
                }, 100);
                
            }
        } else {
            dialog.close();
            document.body.onclick = null;
            dialog.onclick = null;
        }
    }

    function toggleAddDialog (visible) {
        let albumNameInput = document.getElementById('dialog-input-new-album');
        albumNameInput.value = '';
        toggleDialog(newAlbumDialog, visible);
        if (visible) {
            albumNameInput.focus();
        }
    }

    function setAlbumNameInUploadForm(albumName) {
        document.querySelector('input[name="albumName"]').value = albumName || '';
    }

    function validateForm(e) {
        let newAlbumName = getNewAlbumName();
        let createButton = document.getElementById('butAddOk');

        setAlbumNameInUploadForm(newAlbumName);

        createButton["disabled"] = (newAlbumName.length == 0);
        if (e.keyCode == 13 && !createButton["disabled"]) {
            createButton.click();
        }
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
                    sendRequestUpdate();
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

    function deleteAlbumFromMainPage(albumId) {

        let container = document.getElementById("browse-albums");
        let albumDiv = document.getElementById(albumId);
        if (!!container && !!albumDiv) {
            container.removeChild(albumDiv);
        }

        sendRequestUpdate();
    }
    
    function appendOrReplaceAlbum(albumHtml, albumId) {
        var newAlbumDiv = htmlToElement(albumHtml);
        var container = document.getElementById("browse-albums");

        if (!!albumId) {
            let oldAlbumDiv = document.getElementById(albumId);
            container.replaceChild(newAlbumDiv, oldAlbumDiv);
        }
        else {
            container.firstChild ? container.insertBefore(newAlbumDiv, container.firstChild) : container.appendChild(newAlbumDiv);
        }

        sendRequestUpdate();
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

    function showSpinner() {
        spinner.removeAttribute('hidden');
    }

    function hideSpinner() {
        spinner.setAttribute('hidden', true);
    }

    function toggleSpinner(visible) {
        var mainContainer = document.querySelector(".main-container");
        if (visible) {
            mainContainer.style.opacity = 0.2;
        }
        visible ? showSpinner() : hideSpinner();
        if (!visible) {
            mainContainer.style.opacity = 1;
        }
    }

    function initSearch(e) {
        var searchValue = e.target.value.trim();

        document.querySelector("header").classList.add("search-results");
        toggleSpinner(true);

        doSearch(searchValue);
    }

    function hideAlbums() {
        if (!albumPanel.classList.contains("slide-out")) {
            albumPanel.classList.add("slide-out");
        }
        else {
            togglePanel(albumPanel);
        }
        //document.querySelector("header").classList.add("search-results");
    }

    function showAlbums() {
        togglePanel(imagePanel);
        togglePanel(albumPanel);
        setAlbumId('');
        showAlbumTitle();
        document.querySelector("header").classList.remove("search-results");
        document.querySelector("header").classList.remove("album");
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
            searchTitle = keyWords ? '"' + keyWords + '"' : "",
            albumId = getAlbumId();

        if (!urlConfig.searchPageUrl || (!albumId && keyWords.trim() == "")) {
            toggleSpinner(false);
            showAlbums();

            return;
        }

        if (albumId) {
            // Search in current album
            searchString += keyWords ? "&" : "";
            searchString += "albumId=" + albumId;
            searchTitle = getAlbumTitle(albumId);
        }
        doSearchAndShowResults(searchString, searchTitle);
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

    function onResponseReceived(responseText, albumTitle) {
        //hideAlbums();
        if (albumTitle) {
            showAlbumTitle(albumTitle);
        }
        showSearchResults(responseText);
        toggleSpinner(false);
    }

    function doSearchAndShowResults(searchString, albumTitle) {
        var url = urlConfig.searchPageUrl + "?" + searchString;

        if (isPanelVisible(albumPanel)) {
            hideAlbums();
            imagePanel.innerHTML = "";
        }

        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (http.status == 200 && http.responseText !== "") {
                    onResponseReceived(http.responseText, albumTitle);
                    //initPage();
                }
                else {
                    toggleSpinner(false);
                }
            }
        };
        http.send();
    }

    function showAlbumTitle(title) {
        document.getElementById("header_title").innerText = title || "ImageXPert"/*"ImageXPert " + (title ? " / " + title : "")*/;
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
        
        document.getElementById('butAddAlbum').addEventListener('click', function () {
            toggleAddDialog(true);
        });

        document.getElementById('newAlbumLink').addEventListener('click', function () {
            showAlbums();
            toggleAddDialog(true);
        });

        document.getElementById('butAddCancel').addEventListener('click', function () {
            toggleAddDialog(false);
        });

        document.getElementById('butDeleteCancel').addEventListener('click', function () {
            toggleDialog(deleteDialog, false);
        });

        document.getElementById('butAddImages').addEventListener('click', function () {
            return openFileUploadDialog();
        });

        document.getElementById('butAddOk').addEventListener('click', function () {
            toggleAddDialog(false);
            return openFileUploadDialog();
        });

        document.getElementById('dialog-input-new-album').addEventListener('keyup', validateForm);

        backButton.addEventListener('click', function (e) {
            showAlbums();
            clearSearchField();
            e.stopPropagation();
        });
        
        trackMouseClick();
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

    function registerDialogs() {
        newAlbumDialog = document.getElementById('new-album-dialog');
        deleteDialog = document.getElementById('delete-dialog');
        if (!newAlbumDialog.showModal) {
            dialogPolyfill.registerDialog(newAlbumDialog);
            dialogPolyfill.registerDialog(deleteDialog);
        }
    }

    function init() {

        albumPanel = document.getElementById('browse-albums');
        imagePanel = document.getElementById('browse-images');
        menuIcon = document.getElementById('menu-icon');
        backButton = document.getElementById('back-button');
        searchInput = document.getElementById('search-input');
        spinner = document.querySelector('.loader');

        addEventHandling();
        registerDialogs();
        
        global.ixp = ixp;
    }

    function switchToDeleteMode(mainContainer) {
        mainContainer.classList.add("delete");
        document.onclick = function() {
            closeDeleteMode(mainContainer);
        }
    }
    
    function closeDeleteMode(mainContainer) {
        mainContainer.classList.remove('delete');
        document.onclick = null;
    }
    
    function trackMouseClick(target) {

        var startTime, endTime, isTracking, longClick, mainContainer;

        mainContainer = document.querySelector("main");
        
        var trackHold = function() {
            if (!isTracking) {
                return;
            }
            endTime = new Date().getTime();
            longClick = (endTime - startTime >= 1000);
            if (longClick) {
                switchToDeleteMode(mainContainer);
                isTracking = false;
            }
            setTimeout(function() {
                trackHold();
            }, 1);
        };

        mainContainer.addEventListener("click", function (e) {
            if (e.target.classList.contains("album-image")) {
                e.preventDefault();
                e.stopPropagation();
                if (!longClick && isDeleteMode()) {
                    closeDeleteMode(mainContainer);
                }
            }
        });

        mainContainer.addEventListener("mousedown", function (e) {
            if (!e.target.classList.contains("album-image")) {
                return;
            }
            startTime = new Date().getTime();
            isTracking = true;
            trackHold();
        });
        
        mainContainer.addEventListener("mouseup", function (e) {
            isTracking = false;
        });

    }

    function isDeleteMode() {
        return document.querySelector("main").classList.contains("delete");
    }
    
    window.onload = init;

})(this);
