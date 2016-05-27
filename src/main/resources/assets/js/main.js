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