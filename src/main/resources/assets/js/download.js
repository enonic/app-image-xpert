function toggleClass(cls) {
    var mainRegion = document.querySelector("#mainRegion");
    mainRegion.classList.remove("download", "info");
    if (cls) {
        mainRegion.classList.add(cls);
    }
}
function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function syncImage() {
    if (imgPlaceholder) {
        var img = document.querySelector(".fake-image");
        imgPlaceholder.style["background-image"] = "url('" + img.getAttribute("src") + "')";
    }
}

function syncImageSize() {
    if (imgPlaceholder) {
        imgPlaceholder.style["width"] = window.innerWidth + "px";
        imgPlaceholder.style["height"] = window.innerHeight + "px";
    }
}

function loadImage() {
    syncImageSize();
    scaleImage();
}


function requestImage(serviceUrl) {
    var form = document.querySelector(".download-form");
    var request = new XMLHttpRequest();

    toggleClass();

    request.onload = function () {
        if (request.responseText !== "") {
            downloadImage(request.responseText, form);
        }
    };

    request.open("POST", serviceUrl, true);
    request.send(new FormData(form));

    return false;
}

function downloadImage(imageUrl, form) {
    var a = document.createElement('a');
    a.setAttribute("download", "");
    a.setAttribute("href", imageUrl);
    form.appendChild(a);
    a.click();
    form.removeChild(a);
}
