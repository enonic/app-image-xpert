function openDownloadDialog() {
    let dialog = document.querySelector('dialog');

    dialogPolyfill.registerDialog(dialog);

    toggleClass("download");
    dialog.showModal();
}

function closeDownloadDialog() {
    let dialog = document.querySelector('dialog');
    toggleClass();
    dialog.close();
}

function selectOption(e) {
    let selectedOption = e.currentTarget;

    if (!selectedOption || selectedOption.tagName !== 'LI') {
        return;
    }

    let parentElement = selectedOption.parentElement;
    let currentSelection = parentElement.querySelector("li.selected");
    !!currentSelection && currentSelection.classList.remove("active", "selected");

    document.getElementById("formatInput").value = selectedOption.textContent.toLowerCase();
    document.getElementById("formatSelect").value = selectedOption.textContent;
    selectedOption.classList.add("active", "selected");
}

function toggleClass(cls, e) {
    var mainRegion = document.getElementById("main-region");
    mainRegion.classList.remove("download", "info", "edit");
    if (cls) {
        if (typeof cls == "string") {
            cls = [cls];
        }
        cls.forEach(function(cl){
            mainRegion.classList.add(cl);
        });
    }
    if (e) {
        e.stopPropagation();
    }
}

function toggleSelect(select) {
    if (select.classList.contains("active")) {
        select.classList.remove("active");
        return;
    }
    let dropdown = select.querySelector('.dropdown-content');
    dropdown.style.width = select.clientWidth + "px";
    select.classList.add("active");
}

function updateMetaInfo(mediaId) {
    var captionInputEl = document.getElementById('input-caption'),
        artistInputEl = document.getElementById('input-artist'),
        tagsInputEl = document.getElementById('input-tags'),
        caption = captionInputEl.value.trim(),
        artist = artistInputEl.value.trim(),
        tags = tagsInputEl.value.trim(),
        captionEl = document.querySelector('.caption-stored'),
        artistEl = document.querySelector('.artist-stored'),
        tagsEl = document.querySelector('.tags-stored');

    if (!updateMetaServiceUrl || updateMetaServiceUrl == "" || mediaId.trim() == "" ||
        (captionEl.innerHTML == caption && artistEl.innerHTML == artist && tagsEl.innerHTML == tags)) {
        toggleClass("info");

        return;
    }

    var http = new XMLHttpRequest();
    http.open("POST", updateMetaServiceUrl, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {
        if (http.readyState == 4) {
            if (http.status == 200 && http.responseText !== "") {
                var responseObj = JSON.parse(http.responseText);
                if (responseObj.success) {
                    captionEl.innerHTML = caption;
                    if (artist) {
                        artistEl.innerHTML = artist;
                    }
                    if (tags) {
                        tagsEl.innerHTML = tags;
                    }
                }
                else {
                    captionInputEl.value = captionEl.innerHTML;
                    artistInputEl.value = artistEl.innerHTML;
                    tagsInputEl.value = tagsEl.innerHTML;
                }
            }
            toggleSpinner(false);
            toggleClass("info");
        }
    };
    toggleSpinner(true);
    http.send("id=" + mediaId + "&caption=" + caption + "&artist=" + artist + "&tags=" + tags);
}

function toggleSpinner(visible) {
    document.getElementById('ixp-spinner').classList.toggle("visible", visible);
}

function openEditMode(e) {
    toggleClass(['info', 'edit'], e);
    document.querySelector('#input-caption').focus();
}

function closeEditMode(mediaId, e) {
    var mainRegion = document.querySelector("#main-region");
    if (!mainRegion.classList.contains("edit") || e.srcElement.tagName == "INPUT") {
        return;
    }
    updateMetaInfo(mediaId);
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

    closeDownloadDialog();
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

function onMetaInputKeyUp(mediaId, e) {
    if (!!e.keyCode && !(e.keyCode == 13 || e.keyCode == 27)) {
        return;
    }
    
    if (e.keyCode == 27) {
        toggleSpinner(false);
        toggleClass("info");
        
        return;
    }
    
    updateMetaInfo(mediaId);
}