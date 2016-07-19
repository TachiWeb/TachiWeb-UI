var backButton;
var filterButton;
var reverseOrderBtn;
var downloadBtn;
var refreshBtn;
var refreshTooltip;
var openBrowserBtn;
var moreBtn;
var infoTab;
var chaptersTab;
var fadeSpeed = 250;
var infoPanel;
var chaptersPanel;
var spinner;

var chapterMenus;
var chapterButtons;

var infoHeaderElement;
var coverImgElement;
var headerContentElement;
var favBtn;
var favBtnIcon;
var mangaDescElement;
var mangaTitleElement;

var pageListDialog;

var currentInfo;
var currentChapters;
var mangaId = QueryString.id;
var backLink = QueryString.b;
var mangaUrl;

var unreadCheckbox;
var clearFiltersButton;

var filters;
function resetFilters() {
    filters = {
        onlyUnread: false
    };
}
resetFilters();
function mapFiltersToUI() {
    mdlCheckboxCheck(unreadCheckbox, filters.onlyUnread);
}
var sort = {
    reverse: false
};

function onLoad() {
    backButton = $(".back-button");
    filterButton = $("#filter_btn");
    reverseOrderBtn = $("#reverse_order_btn");
    downloadBtn = $("#download_btn");
    refreshBtn = $("#refresh_btn");
    refreshTooltip = $("#refresh_tooltip");
    openBrowserBtn = $("#open_browser_btn");
    moreBtn = $("#more_btn");
    infoTab = $("#info_tab");
    chaptersTab = $("#chapter_tab");
    infoPanel = $("#info_panel");
    chaptersPanel = $("#chapter_panel");
    spinner = $("#info_spinner");

    chapterMenus = $("#chapter_menus");
    chapterButtons = $("#chapter_buttons");

    pageListDialog = $("#page_list_dialog");

    infoHeaderElement = $("#info_header");
    coverImgElement = $("#cover_img");
    headerContentElement = $("#header_content");
    favBtn = $("#fav_btn");
    favBtnIcon = $("#fav_btn_icon");
    mangaDescElement = $("#manga_desc");
    mangaTitleElement = $("#manga_title");

    unreadCheckbox = $("#unread-chkbx");
    clearFiltersButton = $("#clear_filters_btn");

    setupTabs();
    updateInfo();
    updateChapters();
    setupBackButton();
    setupBrowserUrlButton();
    setupFilters();
    setupSort();
    setupDialogs();
    setupFaveButton();
    setupRefreshButton();
}
function setupRefreshButton() {
    refreshBtn.click(function() {
        if(infoTab.hasClass("is-active")) {
            updateServerInfo();
        } else if(chaptersTab.hasClass("is-active")) {
            updateServerChapters();
        }
    });
}
function updateServerInfo() {
    function infoUpdateError() {
        serverUpdateError("manga info", updateServerInfo);
    }
    showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildServerUpdateURL(mangaId, "INFO"), true);
    xhr.onload = function () {
        try {
            var res = JSON.parse(xhr.responseText);
            if (res.success) {
                updateInfo(); //Grab the new updated manga info
            } else {
                infoUpdateError();
            }
        }
        catch (e) {
            console.error(e);
            infoUpdateError();
        }
        hideSpinner();
    };
    xhr.onerror = function () {
        infoUpdateError();
        hideSpinner();
    };
    xhr.send();
}
function updateServerChapters() {
    function chaptersUpdateError() {
        serverUpdateError("chapters", updateServerChapters);
    }
    showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildServerUpdateURL(mangaId, "CHAPTERS"), true);
    xhr.onload = function () {
        try {
            var res = JSON.parse(xhr.responseText);
            if (res.success) {
                //If there are any changes update the chapters list
                if(res.added > 0 || res.removed > 0) {
                    updateChapters();
                }
            } else {
                chaptersUpdateError();
            }
        }
        catch (e) {
            console.error(e);
            chaptersUpdateError();
        }
        hideSpinner();
    };
    xhr.onerror = function () {
        chaptersUpdateError();
        hideSpinner();
    };
    xhr.send();
}
function buildServerUpdateURL(mangaId, updateType) {
    return updateRoot + "/" + mangaId + "/" + updateType;
}
function setupDialogs() {
    //Dialog polyfills
    if (!rawElement(pageListDialog).showModal) {
        dialogPolyfill.registerDialog(rawElement(pageListDialog));
    }
}
function setupSort() {
    reverseOrderBtn.click(function () {
        sort.reverse = !sort.reverse;
        applyAndUpdateChapters(currentChapters);
    });
}
function buildFaveURL(fave) {
    return faveRoot + "/" + mangaId + "?fave=" + fave;
}
function setupFaveButton() {
    favBtn.click(function () {
        showSpinner();
        var xhr = new XMLHttpRequest();
        var newFaveStatus = !currentInfo.favorite;
        xhr.open("GET", buildFaveURL(newFaveStatus), true);
        xhr.onload = function () {
            try {
                var res = JSON.parse(xhr.responseText);
                if (res.success) {
                    currentInfo.favorite = newFaveStatus;
                    updateFaveIcon(newFaveStatus);
                } else {
                    faveUpdateError();
                }
            }
            catch (e) {
                console.error(e);
                faveUpdateError();
            }
            hideSpinner();
        };
        xhr.onerror = function () {
            faveUpdateError();
            hideSpinner();
        };
        xhr.send();
    });
}
function faveUpdateError() {
    snackbar.showSnackbar({
        message: "Error setting favorite status!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            favBtn.click();
        }
    });
}
function setupFilters() {
    unreadCheckbox.change(function () {
        filters.onlyUnread = this.checked;
        applyAndUpdateChapters(currentChapters);
    });
    clearFiltersButton.click(function () {
        resetFilters();
        mapFiltersToUI();
        applyAndUpdateChapters(currentChapters);
    });
}
function setupBackButton() {
    backButton.click(function () {
        if (valid(backLink)) {
            window.location.href = backLink;
        } else {
            window.history.back();
        }
    });
}
function setupTabs() {
    infoTab.click(function () {
        selectInfoTab();
    });
    chaptersTab.click(function () {
        selectChapterTab();
    });
}
function selectInfoTab() {
    filterButton.hide(fadeSpeed);
    reverseOrderBtn.hide(fadeSpeed);
    downloadBtn.hide(fadeSpeed);
    moreBtn.hide(fadeSpeed);
    infoPanel.addClass("selected");
    chaptersPanel.removeClass("selected");
    refreshTooltip.text("Refresh Info");
}
function selectChapterTab() {
    filterButton.show(fadeSpeed);
    reverseOrderBtn.show(fadeSpeed);
    downloadBtn.show(fadeSpeed);
    moreBtn.show(fadeSpeed);
    infoPanel.removeClass("selected");
    chaptersPanel.addClass("selected");
    refreshTooltip.text("Refresh Chapters");
}
function buildInfoUrl(mangaId) {
    return infoRoot + "/" + mangaId;
}
function buildChaptersUrl(mangaId) {
    return chaptersRoot + "/" + mangaId;
}
function updateInfo() {
    showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildInfoUrl(mangaId), true);
    xhr.onload = function () {
        try {
            currentInfo = JSON.parse(xhr.responseText);
            updateInfoUI(currentInfo);
        }
        catch (e) {
            console.error(e);
            infoUpdateError();
        }
        hideSpinner();
    };
    xhr.onerror = function () {
        infoUpdateError();
        hideSpinner();
    };
    xhr.send();
}
function updateChapters() {
    showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildChaptersUrl(mangaId), true);
    xhr.onload = function () {
        try {
            currentChapters = JSON.parse(xhr.responseText);
            applyAndUpdateChapters(currentChapters);
        }
        catch (e) {
            console.error(e);
            chaptersUpdateError();
        }
        hideSpinner();
    };
    xhr.onerror = function () {
        chaptersUpdateError();
        hideSpinner();
    };
    xhr.send();
}
function applyAndUpdateChapters(chapters) {
    var clonedChapters = chapters.slice(0);
    applyFilters(clonedChapters);
    applySort(clonedChapters);
    updateChaptersUI(clonedChapters);
}
function applySort(chapters) {
    chapters.sort(function (a, b) {
        return a.chapter_number - b.chapter_number;
    });
    if (sort.reverse) {
        chapters.reverse();
    }
}
function applyFilters(chapters) {
    for (var i = chapters.length - 1; i >= 0; i--) {
        var chapter = chapters[i];
        var remove = false;
        if (filters.onlyUnread && chapter.read) {
            remove = true;
        }
        if (remove) {
            chapters.splice(i, 1);
        }
    }
}

function buildPageCountUrl(mangaId, chapterId) {
    return pageCountRoot + "/" + mangaId + "/" + chapterId;
}
function openChapter(chapterId, lastPageRead) {
    rawElement(pageListDialog).showModal();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildPageCountUrl(mangaId, chapterId), true);
    xhr.onload = function () {
        var pages = xhr.responseText;
        if (!$.isNumeric(pages)) {
            pageListError(chapterId);
            console.error("Page list was not numeric!");
        } else {
            window.location.href = "reader/reader/reader.html?m=" + mangaId + "&c=" + chapterId + "&mp=" + xhr.responseText + "&p=" + lastPageRead + "&b=" + encodeURIComponent(window.location.href);
        }
        rawElement(pageListDialog).close();
    };
    xhr.onerror = function () {
        pageListError(chapterId);
        rawElement(pageListDialog).close();
    };
    xhr.send();
}

function updateChaptersUI(chapters) {
    clearElement(rawElement(chaptersPanel));
    clearElement(rawElement(chapterMenus));
    clearElement(rawElement(chapterButtons));
    for (var i = 0; i < chapters.length; i++) {
        var chapter = chapters[i];
        var element = document.createElement("div");
        element.className = "chapter_entry mdl-button mdl-js-button mdl-js-ripple-effect";
        if (chapter.read) {
            $(element).css("color", "grey");
        }
        var titleRow = document.createElement("div");
        titleRow.className = "chapter_row";
        var titleElement = document.createElement("div");
        titleElement.className = "chapter_title";
        titleElement.textContent = chapter.name;
        titleRow.appendChild(titleElement);

        //The code below enables VERY HACKY context menus, these menus were hacked together so don't expect them to not be buggy
        //Menu Button
        var menuElement = document.createElement("button");
        menuElement.className = "chapter_button mdl-button mdl-js-button";
        menuElement.id = "chapter_button_" + i;
        $(element).mousedown(function (menuElement, i) {
            return function (event) {
                if (event.which === 3) {
                    if (i === chapters.length - 1) {
                        menuElement.css("right", $(document).width() - event.pageX + "px");
                        menuElement.css("top", -$(document).height() + event.pageY + "px");
                    } else {
                        menuElement.css("left", event.pageX + "px");
                        menuElement.css("top", (event.pageY - 35) + "px");
                    }
                    menuElement.click();
                    event.preventDefault();
                }
            };
        }($(menuElement), i));
        rawElement(chapterButtons).appendChild(menuElement);
        //Menu
        var menu = document.createElement("ul");
        var menuLoc;
        //Last one opens upwards
        if (i === chapters.length - 1) {
            menuLoc = "mdl-menu--top-right";
        } else {
            menuLoc = "mdl-menu--bottom-left";
        }
        menu.className = "chapter_menu mdl-menu mdl-js-ripple-effect " + menuLoc + " mdl-js-menu";
        menu.setAttribute("for", menuElement.id);
        var menuDownloadButton = document.createElement("li");
        menuDownloadButton.className = "mdl-menu__item";
        menuDownloadButton.textContent = "Download";
        menu.appendChild(menuDownloadButton);
        var menuMarkButton = document.createElement("li");
        menuMarkButton.className = "mdl-menu__item";
        menuMarkButton.textContent = "Mark as " + (chapter.read ? "unread" : "read");
        $(menuMarkButton).click(function (chapter) {
            return function () {
                markReadingStatus(chapter, !chapter.read);
            };
        }(chapter));
        menu.appendChild(menuMarkButton);
        rawElement(chapterMenus).appendChild(menu);
        componentHandler.upgradeElement(menuElement);
        componentHandler.upgradeElement(menu);
        componentHandler.upgradeElement(menuDownloadButton);
        componentHandler.upgradeElement(menuMarkButton);

        element.appendChild(titleRow);
        element.appendChild(document.createElement("br"));
        element.appendChild(document.createElement("br"));
        var bottomRow = document.createElement("div");
        bottomRow.className = "chapter_row chapter_row_bottom";
        var dateElement = document.createElement("div");
        dateElement.className = "chapter_date chapter_row_bottom_entry";
        dateElement.textContent = moment(chapter.date).format('L');
        bottomRow.appendChild(dateElement);
        if (!chapter.read && chapter.last_page_read > 0) {
            var pageElement = document.createElement("div");
            pageElement.className = "chapter_page chapter_row_bottom_entry";
            pageElement.textContent = "Page " + (chapter.last_page_read + 1);
            bottomRow.appendChild(pageElement);
        }
        var downloadElement = document.createElement("div");
        downloadElement.className = "chapter_downloaded chapter_row_bottom_entry";
        downloadElement.textContent = ""; //TODO Change when downloading is actually implemented
        bottomRow.appendChild(downloadElement);
        element.appendChild(bottomRow);
        $(element).click(function (chapterId, lastPageRead) {
            return function () {
                openChapter(chapterId, lastPageRead);
            };
        }(chapter.id, chapter.last_page_read));
        chaptersPanel[0].appendChild(element);
        componentHandler.upgradeElement(element);
    }
}
function buildReadingStatusUrl(chapter, read, lastReadPage) {
    return readingStatusRoot + "/" + mangaId + "/" + chapter.id + "?read=" + read
        + (valid(lastReadPage) ? ("&lp=" + lastReadPage) : "");
}
function markReadingStatus(chapter, state) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildReadingStatusUrl(chapter, state, !state ? 0 : null), true);
    xhr.onload = function () {
        try {
            var res = JSON.parse(xhr.responseText);
            if (!res.success) {
                readingStatusError(chapter, state);
            } else {
                chapter.read = state;
                if(!state) {
                    chapter.last_page_read = 0;
                }
                applyAndUpdateChapters(currentChapters);
            }
        } catch (e) {
            readingStatusError(chapter, state);
        }
    };
    xhr.onerror = function () {
        readingStatusError(chapter, state);
    };
    xhr.send();
}
function updateInfoUI(info) {
    //Set title
    mangaTitleElement.text(info.title);
    //Set cover images
    var coverUrl = buildCoverUrl(mangaId);
    infoHeaderElement.css("background", generateHeaderBackgroundCSS(coverUrl));
    //TODO Make this shorthand (does anybody know how to do this?)
    infoHeaderElement.css("background-size", "100% auto");
    coverImgElement.attr("src", coverUrl);
    //Build header content
    var headerContentArray = [];
    if (valid(info.author)) {
        headerContentArray.push(generateHeaderEntry("Author", info.author));
    }
    if (valid(info.artist)) {
        headerContentArray.push(generateHeaderEntry("Artist", info.artist));
    }
    headerContentArray.push(generateHeaderEntry("Chapters", info.chapters));
    headerContentArray.push(generateHeaderEntry("Status", info.status));
    if (valid(info.source)) {
        headerContentArray.push(generateHeaderEntry("Source", info.source));
    }
    if (valid(info.genres)) {
        headerContentArray.push(generateHeaderEntry("Genres", info.genres))
    }
    headerContentElement.html(headerContentArray.join("<br>"));
    //Set description
    if (valid(info.description)) {
        mangaDescElement.html("<strong>Description</strong><br>" + info.description);
    }
    //Set favorite
    updateFaveIcon(info.favorite);
    if (valid(info.url) && info.url !== "") {
        openBrowserBtn.show();
        mangaUrl = info.url;
    } else {
        openBrowserBtn.hide();
    }
}
function updateFaveIcon(fave) {
    if (fave) {
        favBtnIcon.html("turned_in");
    } else {
        favBtnIcon.html("turned_in_not");
    }
}
function setupBrowserUrlButton() {
    openBrowserBtn.click(function () {
        if (valid(mangaUrl)) {
            openInNewTab(mangaUrl);
        }
    });
}
function generateHeaderEntry(subject, description) {
    return "<strong>" + subject + "</strong>&nbsp;&nbsp;" + description;
}
function generateHeaderBackgroundCSS(url) {
    return "linear-gradient(rgba(255, 255, 255, 0.75),rgba(255, 255, 255, 0.75)),url(\"" + url + "\")"
}
function infoUpdateError() {
    snackbar.showSnackbar({
        message: "Error getting manga info!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            updateInfo();
        }
    });
}
function chaptersUpdateError() {
    snackbar.showSnackbar({
        message: "Error getting chapters!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            updateChapters();
        }
    });
}
function pageListError(chapterId) {
    snackbar.showSnackbar({
        message: "Error getting page list!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            openChapter(chapterId);
        }
    });
}
function readingStatusError(chapter, state) {
    snackbar.showSnackbar({
        message: "Error setting reading status!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            markReadingStatus(chapter, state);
        }
    });
}
function serverUpdateError(updateType, retryHandler) {
    snackbar.showSnackbar({
        message: "Error updating " + updateType + "!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: retryHandler
    });
}
function showSpinner() {
    spinner.css("opacity", 1);
}

function hideSpinner() {
    spinner.css("opacity", 0);
}