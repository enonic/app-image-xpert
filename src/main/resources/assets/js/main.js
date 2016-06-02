function toggleLayers() {
    validateForm();
    document.querySelector(".main-container").classList.toggle("hidden");
    document.querySelector(".upload-container").classList.toggle("hidden");
}
function previewImage(event) {
    var previewEl = document.querySelector('.upload-container .image-preview');
    previewEl.style.display = "block";
    previewEl.src = URL.createObjectURL(event.target.files[0]);

    validateForm();
}
function onImageLoad(image) {
    image.style.height = "";
}
function validateForm() {
    var albumArr = Array.prototype.slice.call(document.querySelectorAll(".album-radio")),
        albumSelected = albumArr.some(function(albumButton) {
            return albumButton.checked;
        }),
        fileSelected = document.querySelector(".file-name").value != "";

    document.querySelector(".upload-button").disabled = (albumSelected && fileSelected) ? "" : "true";
}

function openFileUploadDialog() {
    var fileUploadEl = document.querySelector('input[name="file"]');
    if (fileUploadEl) {
        //document.querySelector('.new-album-dialog-container .button-toolbar').classList.add("select-files");
        closeNewAlbumDialog();
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

function closeNewAlbumDialog() {
    document.querySelector('.new-album-dialog-container').classList.remove("visible");
    document.querySelector('.new-album-dialog-container .button-toolbar').classList.remove("select-files");
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
    var rawAlbumName = inputEl.value.trim().toLowerCase(),
        albumName = rawAlbumName.charAt(0).toUpperCase() + rawAlbumName.slice(1);

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