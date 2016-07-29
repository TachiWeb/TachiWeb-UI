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
var downloadDialog;

var downloadBtn1;
var downloadBtn5;
var downloadBtn10;
var downloadBtnUnread;
var downloadBtnAll;
var downloadBtnClose;

var currentInfo;
var currentChapters = [];
var mangaId = QueryString.id;
var backLink = QueryString.b;
var mangaUrl;

var firstUpdate = true;

var unreadCheckbox;
var downloadedCheckbox;
var clearFiltersButton;

var filters;
function resetFilters() {
    filters = {
        onlyUnread: false,
        onlyDownloaded: false
    };
}
resetFilters();
function mapFiltersToUI() {
    mdlCheckboxCheck(unreadCheckbox, filters.onlyUnread);
    mdlCheckboxCheck(downloadedCheckbox, filters.onlyDownloaded);
}
var sort = {
    reverse: false
};

const CHAPTER_UPDATE_FREQ = 1000;

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
    downloadDialog = $("#download_dialog");

    downloadBtn1 = $("#download_btn_1");
    downloadBtn5 = $("#download_btn_5");
    downloadBtn10 = $("#download_btn_10");
    downloadBtnUnread = $("#download_btn_unread");
    downloadBtnAll = $("#download_btn_all");
    downloadBtnClose = $("#download_btn_close");

    infoHeaderElement = $("#info_header");
    coverImgElement = $("#cover_img");
    headerContentElement = $("#header_content");
    favBtn = $("#fav_btn");
    favBtnIcon = $("#fav_btn_icon");
    mangaDescElement = $("#manga_desc");
    mangaTitleElement = $("#manga_title");

    unreadCheckbox = $("#unread-chkbx");
    downloadedCheckbox = $("#download-chkbx");
    clearFiltersButton = $("#clear_filters_btn");

    //Setup various components
    setupTabs();
    updateInfo();
    setupBackButton();
    setupBrowserUrlButton();
    setupFilters();
    setupSort();
    setupDialogs();
    setupFaveButton();
    setupRefreshButton();
    setupFaveCommandListener();
    setupDownloadDialog();
    startUpdatingChapters();
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
        dialogPolyfill.registerDialog(rawElement(downloadDialog));
    }
}
function setupSort() {
    reverseOrderBtn.click(function () {
        sort.reverse = !sort.reverse;
        setServerFlag("SORT_DIRECTION", sort.reverse ? "DESCENDING" : "ASCENDING");
        applyAndUpdateChapters(currentChapters);
    });
}
function setupBrowserUrlButton() {
    openBrowserBtn.click(function () {
        if (mangaUrl) {
            openInNewTab(mangaUrl);
        }
    });
}
function startUpdatingChapters() {
    var realUpdateChapters = function () {
        var onComplete = function () {
            setTimeout(realUpdateChapters, CHAPTER_UPDATE_FREQ);
        };
        //Only update if context menu is not open
        if (!elementExists($(".mdl-menu__container.is-visible"))) {
            updateChapters(false, onComplete);
        } else {
            onComplete();
        }
    };
    realUpdateChapters();
}
function setupDownloadDialog() {
    downloadBtn.click(function () {
        rawElement(downloadDialog).showModal();
    });
    var sortedNotDownloadedOnly = function () {
        var filtered = [];
        for (var i = 0; i < currentChapters.length; i++) {
            var chapter = currentChapters[i];
            if (chapter.download_status === "NOT_DOWNLOADED") {
                filtered.push(chapter);
            }
        }
        applySort(filtered);
        return filtered;
    };
    downloadBtn1.click(function () {
        downloadChapterArray(sortedNotDownloadedOnly().slice(0, 1));
        rawElement(downloadDialog).close();
    });
    downloadBtn5.click(function () {
        downloadChapterArray(sortedNotDownloadedOnly().slice(0, 5));
        rawElement(downloadDialog).close();
    });
    downloadBtn10.click(function () {
        downloadChapterArray(sortedNotDownloadedOnly().slice(0, 10));
        rawElement(downloadDialog).close();
    });
    downloadBtnUnread.click(function () {
        var sortedNotDownloaded = sortedNotDownloadedOnly();
        var filtered = [];
        for (var i = 0; i < sortedNotDownloaded.length; i++) {
            var chapter = sortedNotDownloaded[i];
            if (!chapter.read) {
                filtered.push(chapter);
            }
        }
        downloadChapterArray(filtered);
        rawElement(downloadDialog).close();
    });
    downloadBtnAll.click(function () {
        downloadChapterArray(sortedNotDownloadedOnly());
        rawElement(downloadDialog).close();
    });
    downloadBtnClose.click(function () {
        rawElement(downloadDialog).close();
    });
}
function downloadChapterArray(array) {
    var prev = function () {
        updateChapters();
    };
    for (var i = array.length - 1; i >= 0; i--) {
        prev = function (i, prev) {
            return function () {
                updateChapters();
                downloadChapter(array[i], prev);
            };
        }(i, prev);
    }
    prev();
}
/**
 * Get new manga info from the source.
 */
function updateServerInfo() {
    showSpinner();
    TWApi.Commands.Update.execute(updateInfo, function () {
        serverUpdateError("manga info", updateServerInfo);
    }, {
        mangaId: mangaId,
        updateType: "INFO"
    }, hideSpinner);

}
/**
 * Get new chapter info from the source
 */
function updateServerChapters() {
    showSpinner();
    TWApi.Commands.Update.execute(function (res) {
        //If there are any changes update the chapters list
        if (res.added > 0 || res.removed > 0) {
            updateChapters();
        }
    }, function() {
        serverUpdateError("chapters", updateServerChapters);
    }, {
        mangaId: mangaId,
        updateType: "CHAPTERS"
    }, hideSpinner);
}
function setupFaveCommandListener() {
    BrowserCommand.Favorite.on(function (data) {
        if (data.mangaId === mangaId) {
            if (currentInfo) {
                currentInfo.favorite = data.favorite;
                updateFaveIcon(currentInfo.favorite);
            }
        }
    });
}
function setupFaveButton() {
    favBtn.click(function () {
        showSpinner();
        var newFaveStatus = !currentInfo.favorite;
        TWApi.Commands.Favorite.execute(function() {
            currentInfo.favorite = newFaveStatus;
            updateFaveIcon(newFaveStatus);
            BrowserCommand.Favorite.send({
                mangaId: mangaId,
                favorite: newFaveStatus
            });
        }, faveUpdateError, {
            mangaId: mangaId,
            favorite: newFaveStatus
        }, hideSpinner);
    });
}
function setupFilters() {
    unreadCheckbox.change(function () {
        filters.onlyUnread = this.checked;
        applyAndUpdateChapters(currentChapters);
        setServerFlag("READ_FILTER", filters.onlyUnread ? "UNREAD" : "ALL");
    });
    downloadedCheckbox.change(function () {
        filters.onlyDownloaded = this.checked;
        applyAndUpdateChapters(currentChapters);
        setServerFlag("DOWNLOADED_FILTER", filters.onlyDownloaded ? "DOWNLOADED" : "ALL");
    });
    clearFiltersButton.click(function () {
        resetFilters();
        setServerFlag("READ_FILTER", "ALL");
        setServerFlag("DOWNLOADED_FILTER", "ALL");
        mapFiltersToUI();
        applyAndUpdateChapters(currentChapters);
    });
}
function setupBackButton() {
    backButton.click(function () {
        if (backLink) {
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
 * Get the cached manga info on the server
 */
function updateInfo() {
    showSpinner();
    TWApi.Commands.MangaInfo.execute(function (res) {
        currentInfo = res;
        mapFlagsToRules(res.flags);
        mapFiltersToUI();
        updateInfoUI(currentInfo);
        applyAndUpdateChapters(currentChapters);
    }, infoUpdateError, {
        mangaId: mangaId
    }, hideSpinner);
}
/**
 * Get the cached chapters on the server
 */
function updateChapters(useSpinner, onComplete) {
    if (useSpinner === null || useSpinner === undefined) {
        useSpinner = true;
    }
    if (useSpinner) {
        showSpinner();
    }
    TWApi.Commands.Chapters.execute(function (res) {
        currentChapters = res.content;
        applyAndUpdateChapters(currentChapters);
    }, chaptersUpdateError, {
        mangaId: mangaId
    }, function() {
        if (useSpinner) {
            hideSpinner();
        }
        //If we have no chapters (on first load), refresh chapters
        if (firstUpdate) {
            if (currentChapters && currentChapters.length <= 0) {
                console.log("No chapters on first load, updating chapters...");
                updateServerChapters();
                firstUpdate = false;
            }
        }
        //Call onComplete if necessary
        if (onComplete) {
            onComplete();
        }
    });
}
/**
 * Apply any sorting rules and filters to a list of chapters
 *
 * NOTE: The originally supplied list will be kept intact
 * @param chapters The chapters to apply the rules to
 * @return A new array of chapters with the rules applied
 */
function applyRules(chapters) {
    var clonedChapters = chapters.slice(0);
    applyFilters(clonedChapters);
    applySort(clonedChapters);
    return clonedChapters;
}
/**
 * Apply any sorting rules and filters to a list of chapters and then update the UI with the new chapters
 *
 * NOTE: The originally supplied list will be kept intact
 * @param chapters The chapters to update the UI with
 */
function applyAndUpdateChapters(chapters) {
    updateChaptersUI(applyRules(chapters));
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
        if (!remove && filters.onlyDownloaded && chapter.download_status !== "DOWNLOADED") {
            remove = true;
        }
        if (remove) {
            chapters.splice(i, 1);
        }
    }
}
function mapFlagsToRules(flags) {
    sort.reverse = flags.SORT_DIRECTION === "DESCENDING";
    filters.onlyUnread = flags.READ_FILTER === "UNREAD";
    filters.onlyDownloaded = flags.DOWNLOADED_FILTER === "DOWNLOADED";
}
function setServerFlag(flag, state) {
    TWApi.Commands.SetFlag.execute(null, function () {
        setServerFlagError(flag, state);
    }, {
        mangaId: mangaId,
        flag: flag,
        state: state
    });
}
/**
 * Open the reader to a specific chapter
 * @param chapterId The ID of the chapter to read
 * @param lastPageRead The last read page in the chapter (the reader will start on this page)
 */
function openChapter(chapterId, lastPageRead) {
    rawElement(pageListDialog).showModal();
    TWApi.Commands.PageCount.execute(function(res) {
        window.location.href = "reader/reader/reader.html?m=" + mangaId + "&c=" + chapterId + "&mp=" + res.page_count + "&p=" + lastPageRead + "&b=" + encodeURIComponent(window.location.href);
    }, function() {
        pageListError(chapterId);
    }, {
        mangaId: mangaId,
        chapterId: chapterId
    }, function() {
        rawElement(pageListDialog).close();
    });
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
                        menuElement.css("right", ($(document).width() - 1) - event.pageX + "px");
                        menuElement.css("top", (-$(document).height() + 2) + event.pageY + "px");
                    } else {
                        menuElement.css("left", (event.pageX - 3) + "px");
                        menuElement.css("top", (event.pageY - 38) + "px");
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
        var menuDownloadButton;
        if (chapter.download_status === "NOT_DOWNLOADED") {
            menuDownloadButton = document.createElement("li");
            menuDownloadButton.className = "mdl-menu__item";
            menuDownloadButton.textContent = "Download";
            $(menuDownloadButton).click(function (chapter) {
                return function () {
                    downloadChapter(chapter, function () {
                        updateChapters();
                    });
                };
            }(chapter));
            menu.appendChild(menuDownloadButton);
        } else if (chapter.download_status === "DOWNLOADED") {
            menuDownloadButton = document.createElement("li");
            menuDownloadButton.className = "mdl-menu__item";
            menuDownloadButton.textContent = "Delete";
            $(menuDownloadButton).click(function (chapter) {
                return function () {
                    deleteChapter(chapter, function () {
                        updateChapters();
                    });
                };
            }(chapter));
            menu.appendChild(menuDownloadButton);
        }
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
        if (menuDownloadButton) {
            componentHandler.upgradeElement(menuDownloadButton);
        }
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
        if (chapter.download_status !== "NOT_DOWNLOADED") {
            downloadElement.textContent = chapter.download_status;
        }
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
function downloadChapter(chapter, onSuccess) {
    TWApi.Commands.Download.execute(onSuccess, function () {
        downloadStartError(chapter, onSuccess);
    }, {
        mangaId: mangaId,
        chapterId: chapter.id
    });
}
function deleteChapter(chapter, onSuccess) {
    TWApi.Commands.Download.execute(onSuccess, function () {
        downloadDeleteError(chapter, onSuccess);
    }, {
        mangaId: mangaId,
        chapterId: chapter.id,
        del: true
    });
}
/**
 * Mark the reading status of chapter as read/unread
 * @param chapter The chapter to update
 * @param state Whether or not the chapter is read
 */
function markReadingStatus(chapter, state) {
    TWApi.Commands.ReadingStatus.execute(function() {
        //Update the local chapter state
        chapter.read = state;
        if (!state) {
            chapter.last_page_read = 0;
        }
        //Update the UI to reflect this change
        applyAndUpdateChapters(currentChapters);
    }, function() {
        readingStatusError(chapter, state);
    }, {
        mangaId: mangaId,
        chapterId: chapter.id,
        read: state,
        lastReadPage: !state ? 0 : null
    });
}
/**
 * Update the info tab UI
 * @param info The manga info to update the UI with
 */
function updateInfoUI(info) {
    //Set title
    mangaTitleElement.text(info.title);
    //Set cover images
    var coverUrl = TWApi.Commands.Cover.buildUrl({mangaId: mangaId});
    infoHeaderElement.css("background", generateHeaderBackgroundCSS(coverUrl));
    //TODO Make this shorthand (does anybody know how to do this?)
    infoHeaderElement.css("background-size", "100% auto");
    coverImgElement.attr("src", coverUrl);
    //Build header content
    var headerContentArray = [];
    if (info.author) {
        headerContentArray.push(generateHeaderEntry("Author", info.author));
    }
    if (info.artist) {
        headerContentArray.push(generateHeaderEntry("Artist", info.artist));
    }
    headerContentArray.push(generateHeaderEntry("Chapters", info.chapters));
    headerContentArray.push(generateHeaderEntry("Status", info.status));
    if (info.source) {
        headerContentArray.push(generateHeaderEntry("Source", info.source));
    }
    if (info.genres) {
        headerContentArray.push(generateHeaderEntry("Genres", info.genres))
    }
    headerContentElement.html(headerContentArray.join("<br>"));
    //Set description
    if (info.description) {
        mangaDescElement.html("<strong>Description</strong><br>" + info.description);
    }
    //Set favorite
    updateFaveIcon(info.favorite);
    if (info.url !== "") {
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
function downloadStartError(chapter, onSuccess) {
    snackbar.showSnackbar({
        message: "Error starting download!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            downloadChapter(chapter, onSuccess);
        }
    });
}
function downloadDeleteError(chapter, onSuccess) {
    snackbar.showSnackbar({
        message: "Error deleting download!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            deleteChapter(chapter, onSuccess);
        }
    });
}
function setServerFlagError(flag, state) {
    snackbar.showSnackbar({
        message: "Error saving filters/sorting rules!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            setServerFlag(flag, state);
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