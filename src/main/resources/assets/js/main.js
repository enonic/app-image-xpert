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
    var categoryArr = Array.prototype.slice.call(document.querySelectorAll(".category-radio")),
        categorySelected = categoryArr.some(function(categoryButton) {
            return categoryButton.checked;
        }),
        fileSelected = document.querySelector(".file-name").value != "";

    document.querySelector(".upload-button").disabled = (categorySelected && fileSelected) ? "" : "true";
}