var imageManager = {};
var buttonManager = {};
const imageSlideTime = 350;
const blankImage = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
const brokenImage = "data:image/jpeg;base64,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";
//const apiRoot = "/api";
const apiRoot = "http://localhost:4567/api";
const imgRoot = apiRoot + "/img";
const loaded = "loaded;";
/** http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter **/
var QueryString = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
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
if(!valid(currentPage) || currentPage < 0) {
    currentPage = 0;
}
var maxPages = QueryString.mp;
var lastReqId = QueryString.r;
if(!valid(lastReqId)) {
    lastReqId = 0;
}
var hasNextChapter = QueryString.nc;
var hasPrevChapter = QueryString.pc;
var backLink = QueryString.b;

function onLoad() {
    setupReader();
    setupButtonManager();
    updateButtons();
    loadImages();
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
        this.animating = true;
        new TWEEN.Tween({x: this.readerRowTransform})
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
            }).start();
    };
    imageManager.setReaderRowLoc = function (loc) {
        this.readerRow.css("transform", "translateX(-" + loc + "px)");
        this.readerRowTransform = loc;
    };
    imageManager.goToLeftImage = function (onComplete, animate) {
        if (this.animating) {
            return;
        }
        this.selectedImage = 0;
        var calculatedWidth = this.imgLeft.width() / 2;
        if (animate) {
            this.animateReaderRow(calculatedWidth, onComplete);
        } else {
            this.setReaderRowLoc(calculatedWidth);
            if (valid(onComplete)) {
                onComplete();
            }
        }
        this.imgRight.animate({opacity: 0}, animate ? imageSlideTime : 0);
        this.imgRight.css("pointer-events", "none");
        this.imgCenter.animate({opacity: 0}, animate ? imageSlideTime : 0);
        this.imgCenter.css("pointer-events", "none");
        this.imgLeft.animate({opacity: 1}, animate ? imageSlideTime : 0);
        this.imgLeft.css("pointer-events", "all");
    };
    imageManager.goToCenterImage = function (onComplete, animate) {
        if (this.animating) {
            return;
        }
        this.selectedImage = 1;
        var leftImgWidth = this.imgLeft.width();
        var centerImgWidth = this.imgCenter.width();
        var calculatedWidth = leftImgWidth + (centerImgWidth / 2);
        if (animate) {
            this.animateReaderRow(calculatedWidth, onComplete);
        } else {
            this.setReaderRowLoc(calculatedWidth);
            if (valid(onComplete)) {
                onComplete();
            }
        }
        this.imgRight.animate({opacity: 0}, animate ? imageSlideTime : 0);
        this.imgRight.css("pointer-events", "none");
        this.imgCenter.animate({opacity: 1}, animate ? imageSlideTime : 0);
        this.imgCenter.css("pointer-events", "all");
        this.imgLeft.animate({opacity: 0}, animate ? imageSlideTime : 0);
        this.imgLeft.css("pointer-events", "none");
    };
    imageManager.goToRightImage = function (onComplete, animate) {
        if (this.animating) {
            return;
        }
        this.selectedImage = 2;
        var leftImgWidth = this.imgLeft.width();
        var centerImgWidth = this.imgCenter.width();
        var rightImgWidth = this.imgRight.width();
        var calculatedWidth = leftImgWidth + centerImgWidth + (rightImgWidth / 2);
        if (animate) {
            this.animateReaderRow(calculatedWidth, onComplete);
        } else {
            this.setReaderRowLoc(calculatedWidth);
            if (valid(onComplete)) {
                onComplete();
            }
        }
        this.imgRight.animate({opacity: 1}, animate ? imageSlideTime : 0);
        this.imgRight.css("pointer-events", "all");
        this.imgCenter.animate({opacity: 0}, animate ? imageSlideTime : 0);
        this.imgCenter.css("pointer-events", "none");
        this.imgLeft.animate({opacity: 0}, animate ? imageSlideTime : 0);
        this.imgLeft.css("pointer-events", "all");
    };
    imageManager.goToSelectedImage = function (onComplete, animate) {
        if (this.selectedImage == 0) {
            this.goToLeftImage(onComplete, animate);
        } else if (this.selectedImage == 1) {
            this.goToCenterImage(onComplete, animate);
        } else if (this.selectedImage == 2) {
            this.goToRightImage(onComplete, animate);
        }
    };
    imageManager.getSelectedImage = function () {
        if (this.selectedImage == 0) {
            return this.imgLeft;
        } else if (this.selectedImage == 1) {
            return this.imgCenter;
        } else if (this.selectedImage == 2) {
            return this.imgRight
        }
    };
    $(window).resize(function () {
        imageManager.goToSelectedImage(null, true);
        imageManager.docWidth = $(document).width();
    });
    activateZoom(imageManager.imgLeft);
    activateZoom(imageManager.imgCenter);
    activateZoom(imageManager.imgRight);
    // setupImage(imageManager.imgLeft);
    // setupImage(imageManager.imgCenter);
    // setupImage(imageManager.imgRight);
    imageManager.imgLeft.data(loaded, false);
    imageManager.imgCenter.data(loaded, false);
    imageManager.imgRight.data(loaded, false);
    imageManager.goToSelectedImage(null, true);
}
function hasPrevPage() {
    return currentPage > 0;
}
function hasNextPage() {
    return currentPage < maxPages - 1;
}
//TODO Seamless chapters
function updateButtons() {
    if(hasPrevPage()) {
        enableButton(buttonManager.previousBtn);
    } else {
        disableButton(buttonManager.previousBtn);
    }
    if(hasNextPage()) {
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
    return imgRoot + "/" + mangaId + "/" + chapterId + "/" + page + "/" + lastReqId;
}
function redownloadImageUrl(page) {
    return imgRoot + "/" + mangaId + "/" + chapterId + "/" + page + "/" + (lastReqId++);
}
function activateZoom(image) {
    image.click(function () {
        $.featherlight(`
        <div class="reader_zoom_img">
            <img src="` + image.attr('src') + `" style="transform: ` + getRotationCSS() + `" alt="Zoomable Image"/>
        </div>
        `, {});
    });
}
function setupImage(image) {
    image.on("error", function () {
        image.attr("src", brokenImage);
    });
}
function setupButtonManager() {
    console.log("Setting up button manager...");
    buttonManager = {};
    buttonManager.previousBtn = $("#rbtn_previous_page");
    buttonManager.nextBtn = $("#rbtn_next_page");
    buttonManager.backBtn = $("#back_button");
    buttonManager.fullscreenBtn = $("#fullscreen_button");
    buttonManager.rotateBtn = $("#rotate_button");
    buttonManager.downloadBtn = $("#redownload_button");
    buttonManager.loading = $("#loading_text");
    buttonManager.lock = false;
    buttonManager.nextBtn.click(function () {
        //Locking stuff
        if(buttonManager.lock) return;
        buttonManager.lock = true;
        setTimeout(function() {
            buttonManager.lock = false;
        }, imageSlideTime);
        if(hasNextPage()) {
            if (imageManager.selectedImage === 0) {
                applyRotation(imageManager.imgCenter);
                imageManager.goToCenterImage(function() {
                    updateRotation();
                }, true);
            } else if (imageManager.selectedImage === 1) {
                applyRotation(imageManager.imgRight);
                imageManager.goToRightImage(function () {
                    moveImagesLeft();
                    //TODO Consider no more images
                    imageManager.goToCenterImage(null, false);
                    loadImages();
                    updateRotation();
                }, true);
            }
            currentPage++;
            updateButtons();
        }
    });
    buttonManager.previousBtn.click(function () {
        //Locking stuff
        if(buttonManager.lock) return;
        buttonManager.lock = true;
        setTimeout(function() {
            buttonManager.lock = false;
        }, imageSlideTime);
        if(hasPrevPage()) {
            if (imageManager.selectedImage === 2) {
                applyRotation(imageManager.imgCenter);
                imageManager.goToCenterImage(function() {
                    updateRotation();
                }, true);
            } else if (imageManager.selectedImage === 1) {
                applyRotation(imageManager.imgLeft);
                imageManager.goToLeftImage(function () {
                    moveImagesRight();
                    //TODO Consider no more images
                    imageManager.goToCenterImage(null, false);
                    loadImages();
                    updateRotation();
                }, true);
            }
            currentPage--;
            updateButtons();
        }
    });
    $(document).keydown(function(e) {
        if(e.key === "ArrowRight") {
            buttonManager.nextBtn.click();
        } else if(e.key === "ArrowLeft") {
            buttonManager.previousBtn.click();
        }
    });
    buttonManager.backBtn.click(function() {
        if(valid(backLink)) {
            window.location.href = backLink;
        } else {
            window.history.back();
        }
    });
    buttonManager.fullscreenBtn.click(function() {
        toggleFullScreen();
    });
    buttonManager.rotateBtn.click(function() {
        rotateImage();
    });
    buttonManager.downloadBtn.click(function () {
        var cached = cachedPages[currentPage];
        if(valid(cached)) {
            var type = cached.blob.type;
            var extension = type.substr(type.indexOf("/") + 1);
            saveAs(cached.blob, currentPage + "." + extension);
        }
    });
}
function rotateImage() {
    imageManager.rotation++;
    if(imageManager.rotation >= 4) {
        imageManager.rotation = 0;
    }
    updateRotation();
}
function updateRotation() {
    imageManager.imgLeft.css("transform", "");
    imageManager.imgCenter.css("transform", "");
    imageManager.imgRight.css("transform", "");
    applyRotation(imageManager.getSelectedImage());
}
function getRotationCSS() {
    return "rotate(" + (imageManager.rotation * 90) + "deg)";
}
function applyRotation(image) {
    image.css("transform", getRotationCSS());
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
function moveImagesLeft() {
    copySrcFromTo(imageManager.imgCenter, imageManager.imgLeft);
    copySrcFromTo(imageManager.imgRight, imageManager.imgCenter);
    imageManager.imgRight.attr("src", blankImage);
    imageManager.imgRight.data(loaded, false);
}
function moveImagesRight() {
    copySrcFromTo(imageManager.imgCenter, imageManager.imgRight);
    copySrcFromTo(imageManager.imgLeft, imageManager.imgCenter);
    imageManager.imgLeft.attr("src", blankImage);
    imageManager.imgLeft.data(loaded, false);
}
function loadImages() {
    if(imageManager.selectedImage === 0) {
        tryLoad(imageManager.imgLeft, currentPage);
        tryLoad(imageManager.imgCenter, currentPage + 1);
        tryLoad(imageManager.imgRight, currentPage + 2);
    } else if(imageManager.selectedImage === 1) {
        tryLoad(imageManager.imgLeft, currentPage - 1);
        tryLoad(imageManager.imgCenter, currentPage);
        tryLoad(imageManager.imgRight, currentPage + 1);
    } else if(imageManager.selectedImage === 2) {
        tryLoad(imageManager.imgLeft, currentPage - 2);
        tryLoad(imageManager.imgCenter, currentPage - 1);
        tryLoad(imageManager.imgRight, currentPage);
    }
}
function srcAttrValid(image) {
    var src = image.attr("src");
    return !(src === blankImage || src === brokenImage);

}
var cachedPages = {};
function tryLoad(image, page) {
    if(page >= 0 && page < maxPages && (!image.data(loaded) || !srcAttrValid(image))) {
        if(valid(cachedPages[page])) {
            image.attr("src", cachedPages[page].url);
            image.data(loaded, true);
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imageUrl(page), true);
        xhr.responseType = 'blob';

        xhr.onload = function(e) {
            if (this.status !== 200) {
                console.log("Got image with bad status code: " + this.status + "!");
            } else {
                var url = URL.createObjectURL(xhr.response);
                cachedPages[page] = {url: url, blob: xhr.response};
                image.attr("src", url);
                image.data(loaded, true);
            }
            buttonManager.loading.css("opacity", "0");
        };
        xhr.onerror = function(e) {
            console.log("Error loading image: " + xhr.statusText);
            buttonManager.loading.css("opacity", "0");
        };

        buttonManager.loading.css("opacity", "1");
        xhr.send();
    }
}
function animate(time) {
    requestAnimationFrame(animate);
    if(!imageManager.animating) {
        imageManager.goToSelectedImage(null, false);
    }
    //Keeps Tween updated
    TWEEN.update(time);
}