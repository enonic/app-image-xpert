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
        fileUploadEl.click();
    }
}