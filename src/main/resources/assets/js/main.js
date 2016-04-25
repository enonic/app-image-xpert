function toggleLayers() {
    document.querySelector(".main-container").classList.toggle("hidden");
    document.querySelector(".upload-container").classList.toggle("hidden");
}
function previewImage(event) {
    var previewEl = document.querySelector('.upload-container .image-preview');
    previewEl.style.display = "block";
    previewEl.src = URL.createObjectURL(event.target.files[0]);
}
function onImageLoad(image) {
    image.style.height = "";
}