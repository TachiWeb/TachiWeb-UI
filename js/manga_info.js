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

var firstUpdate = true;

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
    //Grab references to required HTML elements
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

    //Setup various components
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
    refreshBtn.click(function () {
        if (infoTab.hasClass("is-active")) {
            updateServerInfo();
        } else if (chaptersTab.hasClass("is-active")) {
            updateServerChapters();
        }
    });
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
function setupBrowserUrlButton() {
    openBrowserBtn.click(function () {
        if (valid(mangaUrl)) {
            openInNewTab(mangaUrl);
        }
    });
}
/**
 * Get new manga info from the source.
 */
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
/**
 * Get new chapter info from the source
 */
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
                if (res.added > 0 || res.removed > 0) {
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
/**
 * Build the update URL used to get new info from the source
 * @param mangaId The ID of the manga to update.
 * @param updateType The type of update to perform (INFO/CHAPTERS)
 * @returns {string} The built update URL
 */
function buildServerUpdateURL(mangaId, updateType) {
    return updateRoot + "/" + mangaId + "/" + updateType;
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
            if (backLink.toUpperCase() === "CLOSE") {
                window.close();
            } else {
                window.location.href = backLink;
            }
        } else {
            window.history.back();
        }
    });
}
/**
 * Add event listeners to the tabs
 */
function setupTabs() {
    infoTab.click(function () {
        selectInfoTab();
    });
    chaptersTab.click(function () {
        selectChapterTab();
    });
}
//Tab selection methods
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
/**
 * Build the URL used to get the cached manga info on the server
 * @param mangaId The ID of the manga to get the cached info of
 * @returns {string} The generated URL
 */
function buildInfoUrl(mangaId) {
    return infoRoot + "/" + mangaId;
}
/**
 * Build the URL used to get the cached chapters on the server
 * @param mangaId The ID of the manga to get the cached chapters of
 * @returns {string} The generated URL
 */
function buildChaptersUrl(mangaId) {
    return chaptersRoot + "/" + mangaId;
}
/**
 * Build the URL used to determine how many pages a chapter has
 * @param mangaId The ID of the manga the chapter is part of
 * @param chapterId The ID of the chapter to count pages of
 * @returns {string} The generated URL
 */
function buildPageCountUrl(mangaId, chapterId) {
    return pageCountRoot + "/" + mangaId + "/" + chapterId;
}
/**
 * Get the cached manga info on the server
 */
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
/**
 * Get the cached chapters on the server
 */
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
        //If we have no chapters (on first load), refresh chapters
        if (firstUpdate) {
            if (currentChapters.length <= 0) {
                console.log("No chapters on first load, updating chapters...");
                updateServerChapters();
                firstUpdate = false;
            }
        }
    };
    xhr.onerror = function () {
        chaptersUpdateError();
        hideSpinner();
    };
    xhr.send();
}
/**
 * Apply any sorting rules and filters to a list of chapters and then update the UI with the new chapters
 *
 * NOTE: The originally supplied list will be kept intact
 * @param chapters The chapters to update the UI with
 */
function applyAndUpdateChapters(chapters) {
    var clonedChapters = chapters.slice(0);
    applyFilters(clonedChapters);
    applySort(clonedChapters);
    updateChaptersUI(clonedChapters);
}
/**
 * Apply any user specified sorting rules to a list of chapters
 * @param chapters The chapters to apply the sorting rules to
 */
function applySort(chapters) {
    chapters.sort(function (a, b) {
        return a.chapter_number - b.chapter_number;
    });
    if (sort.reverse) {
        chapters.reverse();
    }
}
/**
 * Apply any user specified filters to a list of chapters
 * @param chapters The chapters to apply the filters to
 */
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
/**
 * Open the reader to a specific chapter
 * @param chapterId The ID of the chapter to read
 * @param lastPageRead The last read page in the chapter (the reader will start on this page)
 */
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
/**
 * Update the chapter tab UI
 * @param chapters The chapters to update the UI with
 */
function updateChaptersUI(chapters) {
    //Remove previous chapter items
    clearElement(rawElement(chaptersPanel));
    //Remove previous chapter dropdown menus
    clearElement(rawElement(chapterMenus));
    clearElement(rawElement(chapterButtons));
    for (var i = 0; i < chapters.length; i++) {
        var chapter = chapters[i];
        //Generate the list item
        var element = document.createElement("div");
        element.className = "chapter_entry mdl-button mdl-js-button mdl-js-ripple-effect";
        if (chapter.read) {
            $(element).css("color", "grey");
        }
        //Append the chapter title
        var titleRow = document.createElement("div");
        titleRow.className = "chapter_row";
        var titleElement = document.createElement("div");
        titleElement.className = "chapter_title";
        titleElement.textContent = chapter.name;
        titleRow.appendChild(titleElement);

        //The code below enables VERY HACKY right click context menus, these menus were hacked together so don't expect them to not be buggy
        //Menu Button (invisible, used to place and open the menu where the user right clicked)
        var menuElement = document.createElement("button");
        menuElement.className = "chapter_button mdl-button mdl-js-button";
        menuElement.id = "chapter_button_" + i;
        $(element).mousedown(function (menuElement, i) {
            return function (event) {
                if (event.which === 3) {
                    if (i === chapters.length - 1) {
                        //The context menu for the last chapter opens upward (or else the user cannot click the last button)
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
        //Generate the menu itself
        var menu = document.createElement("ul");
        var menuLoc;
        if (i === chapters.length - 1) {
            //The context menu for the last chapter opens upward (or else the user cannot click the last button)
            menuLoc = "mdl-menu--top-right";
        } else {
            menuLoc = "mdl-menu--bottom-left";
        }
        menu.className = "chapter_menu mdl-menu mdl-js-ripple-effect " + menuLoc + " mdl-js-menu";
        menu.setAttribute("for", menuElement.id);
        //Generate the menu items
        //Download button
        var menuDownloadButton = document.createElement("li");
        menuDownloadButton.className = "mdl-menu__item";
        menuDownloadButton.textContent = "Download";
        menu.appendChild(menuDownloadButton);
        //Mark as read button
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
        //Notify MDL about the new menu
        componentHandler.upgradeElement(menuElement);
        componentHandler.upgradeElement(menu);
        componentHandler.upgradeElement(menuDownloadButton);
        componentHandler.upgradeElement(menuMarkButton);

        element.appendChild(titleRow);
        //Spacing between title text and bottom text of menu item
        element.appendChild(document.createElement("br"));
        element.appendChild(document.createElement("br"));
        //Generate the bottom text
        var bottomRow = document.createElement("div");
        bottomRow.className = "chapter_row chapter_row_bottom";
        //Chapter date
        var dateElement = document.createElement("div");
        dateElement.className = "chapter_date chapter_row_bottom_entry";
        dateElement.textContent = moment(chapter.date).format('L');
        bottomRow.appendChild(dateElement);
        //Last page read (only if the chapter isn't completely read and only if the user has started reading)
        if (!chapter.read && chapter.last_page_read > 0) {
            var pageElement = document.createElement("div");
            pageElement.className = "chapter_page chapter_row_bottom_entry";
            pageElement.textContent = "Page " + (chapter.last_page_read + 1);
            bottomRow.appendChild(pageElement);
        }
        //Downloaded indicator (not enabled because downloading has not been implemented yet)
        var downloadElement = document.createElement("div");
        downloadElement.className = "chapter_downloaded chapter_row_bottom_entry";
        downloadElement.textContent = ""; //TODO Change when downloading is actually implemented
        bottomRow.appendChild(downloadElement);
        element.appendChild(bottomRow);
        //When the user clicks the list item, the reader should open
        $(element).click(function (chapterId, lastPageRead) {
            return function () {
                openChapter(chapterId, lastPageRead);
            };
        }(chapter.id, chapter.last_page_read));
        chaptersPanel[0].appendChild(element);
        //Notify MDL about this new list item
        componentHandler.upgradeElement(element);
    }
}
/**
 * Build the URL used to set the reading status of a chapter on the server side
 * @param chapter The chapter to set the reading status of
 * @param read Whether or not the chapter is read
 * @param lastReadPage The new last read page (or null to leave it the same)
 * @returns {string} The built URL
 */
function buildReadingStatusUrl(chapter, read, lastReadPage) {
    return readingStatusRoot + "/" + mangaId + "/" + chapter.id + "?read=" + read
        + (valid(lastReadPage) ? ("&lp=" + lastReadPage) : "");
}
/**
 * Mark the reading status of chapter as read/unread
 * @param chapter The chapter to update
 * @param state Whether or not the chapter is read
 */
function markReadingStatus(chapter, state) {
    var xhr = new XMLHttpRequest();
    //The last read page is set to 0 when marking as unread
    xhr.open("GET", buildReadingStatusUrl(chapter, state, !state ? 0 : null), true);
    xhr.onload = function () {
        try {
            var res = JSON.parse(xhr.responseText);
            if (!res.success) {
                readingStatusError(chapter, state);
            } else {
                //Update the local chapter state
                chapter.read = state;
                if (!state) {
                    chapter.last_page_read = 0;
                }
                //Update the UI to reflect this change
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
/**
 * Update the info tab UI
 * @param info The manga info to update the UI with
 */
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
/**
 * Update the icon of the favorite button.
 * @param fave Whether or not the manga is a favorite
 */
function updateFaveIcon(fave) {
    if (fave) {
        favBtnIcon.html("turned_in");
    } else {
        favBtnIcon.html("turned_in_not");
    }
}
/**
 * Generate a header entry used in the manga info tab's header
 *
 * Example generated output with formatting removed: "Genre: Shoujo Ai, Action"
 * @param subject The subject of the entry
 * @param description The content of the entry
 * @returns {string} The generated HTML code.
 */
function generateHeaderEntry(subject, description) {
    return "<strong>" + subject + "</strong>&nbsp;&nbsp;" + description;
}
/**
 * Generate the CSS styles used to display the tinted background in the manga info tab
 * @param url The URL of the cover image to use as the tinted background image
 * @returns {string} The generated CSS styles
 */
function generateHeaderBackgroundCSS(url) {
    return "linear-gradient(rgba(255, 255, 255, 0.75),rgba(255, 255, 255, 0.75)),url(\"" + url + "\")"
}

//Error messages
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
/**
 * Show the loading spinner
 */
function showSpinner() {
    spinner.css("opacity", 1);
}

/**
 * Hide the loading spinner
 */
function hideSpinner() {
    spinner.css("opacity", 0);
}