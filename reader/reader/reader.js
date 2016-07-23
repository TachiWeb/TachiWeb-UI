var imageManager = {};
var buttonManager = {};
var hudManager = {};
const imageSlideTime = 350;
const blankImage = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
const brokenImage = "data:image/jpeg;base64,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";
const apiRoot = "/api";
var readingStatusRoot = apiRoot + "/reading_status";
const imgRoot = apiRoot + "/img";
const loaded = "loaded;";
/** http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter **/
var QueryString = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            query_string[pair[0]] = [query_string[pair[0]], decodeURIComponent(pair[1])];
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();
function valid(v) {
    return v !== undefined && v !== null;
}
var mangaId = QueryString.m;
var mangaName = QueryString.mn;
var chapterId = QueryString.c;
var currentPage = QueryString.p;
if (!valid(currentPage) || currentPage < 0) {
    currentPage = 0;
}
var maxPages = QueryString.mp;
var hasNextChapter = QueryString.nc;
var hasPrevChapter = QueryString.pc;
var backLink = QueryString.b;
var rightToLeft = QueryString.rtl;
if (!valid(rightToLeft)) {
    rightToLeft = false;
}

function onLoad() {
    setupHudManager();
    setupReader();
    setupButtonManager();
    updateButtons();
    loadNextImage();
    requestAnimationFrame(animate);
}
function setupReader() {
    console.log("Setting up reader...");
    setupImageManager();
}
function setupImageManager() {
    console.log("Setting up image manager...");
    imageManager = {};
    imageManager.readerRow = $("#reader_img_row");
    imageManager.imgLeft = $("#reader_img_left");
    imageManager.imgCenter = $("#reader_img_center");
    imageManager.imgRight = $("#reader_img_right");
    imageManager.selectedImage = 0;
    imageManager.animating = false;
    imageManager.readerRowTransform = 0;
    imageManager.docWidth = $(document).width();
    imageManager.rotation = 0;
    imageManager.animateReaderRow = function (to, onComplete) {
        var that = this;
        this.animation = new TWEEN.Tween({x: this.readerRowTransform})
            .to({x: to}, imageSlideTime)
            .onUpdate(function () {
                that.setReaderRowLoc(this.x);
            })
            .easing(TWEEN.Easing.Quartic.Out)
            .onComplete(function () {
                that.animating = false;
                if (valid(onComplete)) {
                    onComplete();
                }
            });
        this.animation.start();
    };
    //Setup reader row
    imageManager.setReaderRowLoc = function (loc) {
        var that = this;
        that.readerRow.css("transform", "translateX(-" + loc + "px)");
        that.readerRowTransform = loc;
    };
    imageManager.readerElements = [];
    imageManager.wrapperElements = [];
    imageManager.setupReaderElements = function () {
        var that = this;
        that.docWidth = $(document).width();
        for (var i = 0; i < imageManager.wrapperElements.length; i++) {
            that.wrapperElements[i].css("width", (imageManager.docWidth - 200) + "px");
        }
    };
    var tmpImageArray = [];
    for (var i = 0; i < maxPages; i++) {
        var readerElement = document.createElement("div");
        readerElement.className = "reader_img_wrapper";
        tmpImageArray.push(readerElement);
        imageManager.wrapperElements.push($(readerElement));
        var nestedReaderElement = document.createElement("div");
        nestedReaderElement.className = "reader_img";
        imageManager.readerElements.push($(nestedReaderElement));
        readerElement.appendChild(nestedReaderElement);
        var jqueryReaderElement = $(nestedReaderElement);
        jqueryReaderElement.data(loaded, false);
    }
    //Deal with right to left
    if (rightToLeft) {
        tmpImageArray.reverse();
    }
    for (i = 0; i < tmpImageArray.length; i++) {
        imageManager.readerRow[0].appendChild(tmpImageArray[i]);
    }
    imageManager.setupReaderElements();
    imageManager.goToImage = function (image, onComplete, animate) {
        var that = this;
        if (valid(that.animation)) {
            that.animation.stop();
            that.animation = null;
        }
        var loc;
        var i;
        if (rightToLeft) {
            loc = imageManager.docWidth / 2;
            for (i = maxPages - 1; i > image; i--) {
                loc += imageManager.docWidth;
            }
        } else {
            loc = imageManager.docWidth / 2;
            for (i = 0; i < image; i++) {
                loc += imageManager.docWidth;
            }
        }
        if (animate) {
            this.animateReaderRow(loc, onComplete);
        } else {
            this.setReaderRowLoc(loc);
            if (valid(onComplete)) {
                onComplete();
            }
        }
        if (currentPage !== image) {
            updateReadingStatus(parseInt(image));
        }
        currentPage = image;
        updateHudPageNumber();
    };
    imageManager.goToSelectedImage = function (onComplete, animate) {
        this.goToImage(currentPage, onComplete, animate);
    };
    imageManager.getSelectedImage = function () {
        var that = this;
        return that.readerElements[that.selectedImage];
    };
    $(window).resize(function () {
        imageManager.setupReaderElements();
        imageManager.goToSelectedImage(null, false);
    });
    imageManager.goToSelectedImage(null, true);
}
function updateReadingStatus(page) {
    var url;
    if (page === parseInt(maxPages) - 1) {
        url = lastPageReadUrl(page, true);
    } else {
        url = lastPageUrl(page);
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        try {
            var res = JSON.parse(xhr.responseText);
            if (!res.success) {
                console.warn("Failed to set reading status!");
            }
        } catch (e) {
            console.warn("Failed to set reading status!", e);
        }
    };
    xhr.onerror = function () {
        console.warn("Failed to set reading status!");
    };
    xhr.send();
}
function hasPrevPage() {
    return currentPage > 0;
}
function hasNextPage() {
    return currentPage < maxPages - 1;
}
//TODO Seamless chapters
function updateButtons() {
    if (hasPrevPage()) {
        enableButton(buttonManager.previousBtn);
    } else {
        disableButton(buttonManager.previousBtn);
    }
    if (hasNextPage()) {
        enableButton(buttonManager.nextBtn);
    } else {
        disableButton(buttonManager.nextBtn);
    }
}
var disabledButtonClass = "rbtn_disabled";
function disableButton(button) {
    button.addClass(disabledButtonClass);
}
function enableButton(button) {
    button.removeClass(disabledButtonClass);
}
function imageUrl(page) {
    return imgRoot + "/" + mangaId + "/" + chapterId + "/" + page;
}
function lastPageUrl(page) {
    return readingStatusRoot + "/" + mangaId + "/" + chapterId + "?lp=" + page;
}
function lastPageReadUrl(page, read) {
    return readingStatusRoot + "/" + mangaId + "/" + chapterId + "?lp=" + page + "&read=" + read;
}
function activateZoom(image) {
    image.click(function () {
        $.featherlight(`
        <div class="dragscroll reader_zoom_img">
            <img src="` + image.data('src') + `" style="transform: ` + getRotationCSS() + `" alt="Zoomable Image"/>
        </div>
        `, {});
        var content = $(".featherlight-content");
        content.addClass("dragscroll");
        content.mousedown(function () {
            content.css("cursor", "move");
        });
        content.mouseup(function() {
            content.css("cursor", "");
        });
        dragscroll.reset();
    });
}
function setupButtonManager() {
    console.log("Setting up button manager...");
    buttonManager = {};
    buttonManager.previousBtn = $("#rbtn_previous_page");
    buttonManager.nextBtn = $("#rbtn_next_page");
    //Do this before the buttons are switched so after they are switched the keyboard buttons work properly
    $(document).keydown(function (nextBtn, previousBtn) {
        return function(e) {
            //Right or space will go to next page
            if (e.key === "ArrowRight" || (!rightToLeft && (e.keyCode === 0 || e.keyCode === 32))) {
                nextBtn.click();
            } else if (e.key === "ArrowLeft" || (rightToLeft && (e.keyCode === 0 || e.keyCode === 32))) {
                previousBtn.click();
            }
        };
    }(buttonManager.nextBtn, buttonManager.previousBtn));
    //Swap buttons if left to right
    if (rightToLeft) {
        [buttonManager.previousBtn, buttonManager.nextBtn] = [buttonManager.nextBtn, buttonManager.previousBtn];
    }
    buttonManager.backBtn = $("#back_button");
    buttonManager.fullscreenBtn = $("#fullscreen_button");
    buttonManager.rotateBtn = $("#rotate_button");
    buttonManager.downloadBtn = $("#download_button");
    buttonManager.redownloadBtn = $("#redownload_button");
    buttonManager.lock = false;
    buttonManager.nextBtn.click(function () {
        if (hasNextPage()) {
            imageManager.goToImage(parseInt(currentPage) + 1, null, true);
            updateButtons();
        }
    });
    buttonManager.previousBtn.click(function () {
        if (hasPrevPage()) {
            imageManager.goToImage(parseInt(currentPage) - 1, null, true);
            updateButtons();
        }
    });
    buttonManager.backBtn.click(function () {
        if (valid(backLink)) {
            window.location.href = backLink;
        } else {
            window.history.back();
        }
    });
    buttonManager.fullscreenBtn.click(function () {
        toggleFullScreen();
    });
    buttonManager.rotateBtn.click(function () {
        rotateImage();
    });
    buttonManager.downloadBtn.click(function () {
        var cached = cachedPages[currentPage];
        if (valid(cached)) {
            var type = cached.blob.type;
            var extension = type.substr(type.indexOf("/") + 1);
            saveAs(cached.blob, currentPage + "." + extension);
        }
    });
    buttonManager.redownloadBtn.click(function (){
        refreshCurrentPage();
    });
    //Catch shift keys for changing the buttons around
    $(window).keydown(function (e) {
        if (e.keyCode == 16) {
            showExtraButtons();
        }
    });
    $(window).keyup(function (e) {
        if (e.keyCode == 16) {
            hideExtraButtons();
        }
    });
}
function showExtraButtons() {
    buttonManager.downloadBtn.css("display", "none");
    buttonManager.redownloadBtn.css("display", "initial");
}
function hideExtraButtons() {
    buttonManager.downloadBtn.css("display", "initial");
    buttonManager.redownloadBtn.css("display", "none");
}
function refreshCurrentPage() {
    var parsedCurrentPage = parseInt(currentPage);
    jqueryPageElement(parsedCurrentPage).data(loaded, false);
    jqueryPageElement(parsedCurrentPage).css("background-image", "");
    properlyScaleImage(image);
    tryLoad(jqueryPageElement(parsedCurrentPage), parsedCurrentPage);
}
function setupHudManager() {
    console.log("Setting up HUD manager...");
    hudManager = {};
    hudManager.pageText = $("#page_indicator");
    hudManager.pageSlider = $("#page_slider");
    hudManager.pageSlider.attr("min", 1);
    hudManager.pageSlider.attr("max", maxPages);
    hudManager.pageSlider.on("input change", function() {
        imageManager.goToImage(hudManager.pageSlider[0].value - 1, null, true);
        updateButtons();
    });
    //Rotate slider if RTL
    if(rightToLeft) {
        $("#page_slider_wrapper").css("transform", "rotate(180deg)");
    }
    componentHandler.upgradeElement(hudManager.pageSlider[0]);
    updateHudPageNumber();
}
function updateHudPageNumber() {
    setHudPageNumber(parseInt(currentPage) + 1);
}
function setHudPageNumber(page) {
    hudManager.pageText.text("Page " + page + "/" + maxPages);
    hudManager.pageSlider[0].MaterialSlider.change(page);
}
function rotateImage() {
    imageManager.rotation++;
    if (imageManager.rotation >= 4) {
        imageManager.rotation = 0;
    }
    updateRotation();
}
function updateRotation() {
    for (var i = 0; i < imageManager.readerElements.length; i++) {
        applyRotation(imageManager.readerElements[i]);
    }
}
function getRotationCSS() {
    return "rotate(" + (imageManager.rotation * 90) + "deg)";
}
function applyRotation(image) {
    image.css("transform", getRotationCSS());
    //Reverse dimensions
    if (imageManager.rotation % 2) {
        image.css("width", $(document).height() + "px");
    } else {
        image.css("width", "");
    }
}
function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}
function copySrcFromTo(i1, i2) {
    i2.attr("src", i1.attr("src"));
}
function setImageSource(image, src) {
    image.css("background-image", "url(\"" + src + "\")");
    image.data("src", src);
    properlyScaleImage(image);
}
function properlyScaleImage(image) {
    var src = image.data("src");
    var img = new Image;
    img.onload = function () {
        if (img.width < image.width() && img.height < image.height()) {
            image.css("background-size", "auto auto");
        } else {
            image.css("background-size", "contain");
        }
    };
    img.src = src;
}
//Rescale images on window resize
$(window).resize(function () {
    for (var i = 0; i < maxPages; i++) {
        var image = imageManager.readerElements[i];
        if (image.data(loaded)) {
            properlyScaleImage(image);
            applyRotation(image);
        }
    }
});
var cachedPages = {};
function tryLoad(image, page) {
    if (page >= 0 && page < maxPages && (!image.data(loaded))) {
        if (valid(cachedPages[page])) {
            setImageSource(image, cachedPages[page].url);
            image.data(loaded, true);
            activateZoom(image);
            loadNextImage();
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imageUrl(page), true);
        xhr.responseType = 'blob';

        xhr.onload = function (e) {
            if (this.status !== 200) {
                console.log("Got image with bad status code: " + this.status + "!");
            } else {
                var url = URL.createObjectURL(xhr.response);
                cachedPages[page] = {url: url, blob: xhr.response};
                setImageSource(image, cachedPages[page].url);
                image.data(loaded, true);
                activateZoom(image);
            }
            loadNextImage();
        };
        xhr.onerror = function (e) {
            console.error("Error loading image: " + xhr.statusText, e);
            loadNextImage();
        };
        xhr.send();
    } else {
        loadNextImage();
    }
}
function jqueryPageElement(page) {
    return imageManager.readerElements[page];
}
function loadNextImage() {
    function findNotLoadedPage(from, to) {
        function shouldLoad(page) {
            return !jqueryPageElement(page).data(loaded);
        }

        var i;
        if (to > from) {
            for (i = Math.max(from + 1, 0); i <= Math.min(to, maxPages - 1); i++) {
                if (shouldLoad(i)) {
                    return i;
                }
            }
        } else {
            for (i = Math.min(from - 1, maxPages - 1); i >= Math.max(to, 0); i--) {
                if (shouldLoad(i)) {
                    return i;
                }
            }
        }
        return null;
    }

    var nextPageToLoad = null;
    if (!jqueryPageElement(parseInt(currentPage)).data(loaded)) {
        nextPageToLoad = parseInt(currentPage);
    }
    //TODO Make these configurable???
    //Search three pages ahead, then one behind, then three ahead, then one behind and so on...
    for (var i = 1; i <= maxPages; i++) {
        if (!valid(nextPageToLoad)) {
            //Check next 3 pages
            nextPageToLoad = findNotLoadedPage(parseInt(currentPage), parseInt(currentPage) + (i * 3));
        } else {
            break;
        }
        if (!valid(nextPageToLoad)) {
            //Check previous page
            nextPageToLoad = findNotLoadedPage(parseInt(currentPage), parseInt(currentPage) - i);
        } else {
            break;
        }
    }
    //Load the image if there is one to load!
    if (valid(nextPageToLoad)) {
        console.log("Loading page: " + nextPageToLoad);
        tryLoad(jqueryPageElement(nextPageToLoad), nextPageToLoad);
    } else {
        console.log("No more pages to load!");
    }
}
function animate(time) {
    requestAnimationFrame(animate);
    //Keeps Tween updated
    TWEEN.update(time);
}