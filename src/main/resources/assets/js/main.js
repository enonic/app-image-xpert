function onImageLoad(image) {
    image.style.height = "";
}

function createNewAlbum(formEl) {
    closeNewAlbumDialog();
    formEl.submit();
}

function openFileUploadDialog() {
    var fileUploadEl = document.querySelector('input[name="file"]');
    document.body.onfocus = closeNewAlbumDialog.bind(this, true);

    if (fileUploadEl) {
        document.querySelector('.new-album-dialog-container').classList.add("select-files");
        fileUploadEl.click();
    }
    return false;
}

function openNewAlbumDialog() {
    var albumNameTextBox = document.querySelector('input[name="albumName"]');
    var createButton = document.querySelector('.button-create');

    if (!!albumNameTextBox && !!createButton) {
        albumNameTextBox.value = "";
        createButton["disabled"] = true;
    }
    document.querySelector('.new-album-dialog-container').classList.add("visible");
    document.querySelector('input[name="albumName"]').focus();
}

function closeNewAlbumDialog(canceled) {
    document.body.onfocus = null;
    if (canceled) {
        document.querySelector('.search-input').focus();
    }
    var newAlbumDialog = document.querySelector('.new-album-dialog-container');
    if (newAlbumDialog) {
        document.querySelector('.new-album-dialog-container').classList.remove("visible", "select-files");
    }
}

function validateForm() {
    var createButton = document.querySelector('.button-create');
    var albumNameTextBox = document.querySelector('input[name="albumName"]');
    if (!!createButton && !!albumNameTextBox) {
        createButton["disabled"] = (albumNameTextBox.value.trim().length == 0);
    }
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