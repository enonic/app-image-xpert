function onImageLoad(image) {
    image.style.height = "";
}

function createNewAlbum(formEl) {
    closeNewAlbumDialog();
    formEl.submit();
}

function isChrome() {
    return navigator.userAgent.search("Chrome") > -1;
}

function getNewAlbumName() {
    var albumName = '',
        albumNameTextBox = document.querySelector('input[name="albumName"]');

    if (albumNameTextBox) {
        albumName = albumNameTextBox.value.trim();
    }

    return albumName;
}

function setNewAlbumName(albumName) {
    var newAlbumSpanEl = document.getElementById('album-name-span-new');
    newAlbumSpanEl.innerText = albumName;
    newAlbumSpanEl.classList.toggle('hidden', albumName=='');
}

function openFileUploadDialog() {
    var albumName = getNewAlbumName();
    var fileUploadEl = document.querySelector('input[name="file"]');
    if (isChrome()) {
        document.body.onfocus = closeNewAlbumDialog.bind(this, true);
    }

    if (fileUploadEl) {
        if (isChrome()) {
            document.querySelector('.new-album-dialog-container').classList.add("select-files");
            setNewAlbumName(albumName);
        }
        else {
            closeNewAlbumDialog();
        }
        fileUploadEl.click();
    }
    return false;
}

function openNewAlbumDialog() {
    var newAlbumDialogContainer = document.querySelector('.new-album-dialog-container');
    var albumNameTextBox = newAlbumDialogContainer.querySelector('input[name="albumName"]');
    var createButton = newAlbumDialogContainer.querySelector('.button-create');

    if (!!albumNameTextBox && !!createButton) {
        albumNameTextBox.value = "";
        createButton["disabled"] = true;
    }

    newAlbumDialogContainer.classList.add("visible");
    document.querySelector('.main-container').classList.add("new-album");
    if (isChrome()) {
        setNewAlbumName('');
    }
    albumNameTextBox.focus();
}

function closeNewAlbumDialog(canceled) {
    document.querySelector('.new-album-dialog-container').classList.remove("visible", "select-files");
    document.querySelector('.main-container').classList.remove("new-album");
    if (!isChrome()) {
        return;
    }
    document.body.onfocus = null;
    setNewAlbumName('');
    if (canceled) {
        document.querySelector('.search-input').focus();
    }
}

function validateForm() {
    var createButton = document.querySelector('.button-create');
    createButton["disabled"] = (getNewAlbumName().length == 0);
}

function editAlbumName(id) {
    var spanEl = document.querySelector('#album-name-span-' + id),
        inputEl = document.querySelector('#album-name-input-' + id);

    inputEl.onCloseEditMode = closeEditMode.bind(this, spanEl, inputEl, id);

    inputEl.addEventListener("click", onAlbumNameClick);
    inputEl.addEventListener("keyup", inputEl.onCloseEditMode);
    document.addEventListener("click", inputEl.onCloseEditMode);

    inputEl.value = spanEl.innerText;

    spanEl.classList.add("hidden");
    inputEl.classList.add("visible");

    inputEl.focus();
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

    if (!renameAlbumServiceUrl || renameAlbumServiceUrl == "" || albumName == "" || spanEl.innerText == albumName) {
        spanEl.classList.remove("hidden");
        inputEl.classList.remove("visible");
        return;
    }

    var http = new XMLHttpRequest();
    http.open("POST", renameAlbumServiceUrl, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200 && http.responseText !== "") {
            var responseObj = JSON.parse(http.responseText);
            if (responseObj.name !== "" && responseObj.name === albumName) {
                spanEl.innerText = responseObj.name;
                spanEl.classList.remove("hidden");
                inputEl.classList.remove("visible");
            }
        }
    };
    http.send("id=" + id + "&name=" + albumName);
}

function showSearchField() {
    var searchForm = document.querySelector('.search-form');
    searchForm.style.display = 'block';
    searchForm.querySelector('.search-input').focus();
}

function submitSearch() {
    var searchForm = document.querySelector('.search-form'),
        searchInput = document.querySelector('.search-input');

    if (searchInput.value == "") {
        searchForm.style.display = 'none';
    }
    else {
        searchForm.submit();
    }

    return false;
}