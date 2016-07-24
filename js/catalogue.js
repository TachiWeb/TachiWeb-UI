var spinner;
var sourcesSelect;
var mangaGrid;
var scrollBox;
var searchBox;

var loginDialog;
var loginDialogTitle;
var loginDialogUsername;
var loginDialogPassword;
var loginDialogClose;
var loginDialogLogin;
var dialogSpinner;

var currentRequest = null;
var currentSources = [];

var typingTimer;
var doneTypingInterval = 250;

var scrollEndPadding = 1000;

var searchState;
function resetSearchState() {
    searchState = {
        query: null,
        lastUrl: null,
        page: 1
    };
}
resetSearchState();

function onLoad() {
    spinner = $(".loading_spinner");
    sourcesSelect = $("#sources_select");
    mangaGrid = $("#manga_grid");
    scrollBox = $("#page_wrapper");
    searchBox = $("#search_box");

    loginDialog = $("#login_dialog");
    loginDialogTitle = $("#login_dialog_title");
    loginDialogUsername = $("#login_dialog_username");
    loginDialogPassword = $("#login_dialog_password");
    loginDialogClose = $("#login_dialog_close");
    loginDialogLogin = $("#login_dialog_login");
    dialogSpinner = $("#login_loading_spinner");

    setupLoginDialog();
    setupSourcesSelect();
    setupScrollBox();
    setupSearchBox();
    refreshSources();
}

function setupLoginDialog() {
    if (!rawElement(loginDialog).showModal) {
        dialogPolyfill.registerDialog(rawElement(loginDialog));
    }
    loginDialogClose.click(function() {
        rawElement(loginDialog).close();
    });
    loginDialogLogin.click(function() {
        loginDialogClose.prop("disabled", true);
        loginDialogLogin.prop("disabled", true);
        loginDialogUsername.prop("disabled", true);
        loginDialogPassword.prop("disabled", true);
        dialogSpinner.css("display", "initial");
        var xhr = new XMLHttpRequest();
        xhr.open("GET", buildLoginUrl(), true);
        xhr.onload = function () {
            try {
                var res = JSON.parse(xhr.responseText);
                if (res.success) {
                    refreshSources();
                } else {
                    sourceLoginError(res.error);
                }
            } catch (e) {
                sourceLoginError("Unknown Javascript error");
                console.error(e);
            }
            rawElement(loginDialog).close();
        };
        xhr.onerror = function () {
            sourceLoginError("Unknown error");
            rawElement(loginDialog).close();
        };
        xhr.send();
    })
}

function buildLoginUrl() {
    return sourceLoginRoot + "/" + rawElement(sourcesSelect).value + "?username=" + encodeURIComponent(loginDialogUsername.val()) + "&password=" + encodeURIComponent(loginDialogPassword);
}

function setupSearchBox() {
    /** http://stackoverflow.com/questions/4220126/run-javascript-function-when-user-finishes-typing-instead-of-on-key-up **/
    searchBox.on("keyup", function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(performSearch, doneTypingInterval);
    });
    searchBox.on("keydown", function() {
        clearTimeout(typingTimer);
    });
}

function performSearch() {
    searchState.page = 1;
    searchState.lastUrl = null;
    var searchText = rawElement(searchBox).value;
    if(searchText.trim() !== "") {
        searchState.query = searchText;
    } else {
        //Set to null if no query
        searchState.query = null;
    }
    scrollBox.scrollTop(0);
    clearElement(mangaGrid);
    refreshCatalogue();
}

function setupScrollBox() {
    scrollBox.on('scroll', function() {
        if(scrollBox.scrollTop() + scrollBox.innerHeight() >= rawElement(scrollBox).scrollHeight - scrollEndPadding) {
            if(hasNextPage() && !isRefreshing()) {
                searchState.page++;
                refreshCatalogue();
            }
        }
    });
}

function setupSourcesSelect() {
    sourcesSelect.change(function() {
        var selectedSource = getCurrentSource();
        if(valid(selectedSource) && !selectedSource["logged_in"]) {
            showLoginBox(selectedSource);
        } else {
            searchState.page = 1;
            searchState.lastUrl = null;
            scrollBox.scrollTop(0);
            clearElement(mangaGrid);
            refreshCatalogue();
        }
    });
}

function showLoginBox(source) {
    loginDialogTitle.text(source.name + " Login");
    loginDialogUsername.val("");
    loginDialogPassword.val("");
    loginDialogClose.prop('disabled', false);
    loginDialogLogin.prop('disabled', false);
    loginDialogUsername.prop("disabled", false);
    loginDialogPassword.prop("disabled", false);
    loginDialog.data("source", source);
    dialogSpinner.css("display", "");
    rawElement(loginDialog).showModal();
}

function getCurrentSource() {
    var currentSourceID = parseInt(rawElement(sourcesSelect).value);
    for(var i = 0; i < currentSources.length; i++) {
        var currentSource = currentSources[i];
        if(currentSource.id === currentSourceID) {
            return currentSource;
        }
    }
    return null;
}

function showSpinner() {
    spinner.css("opacity", 1);
}

function hideSpinner() {
    spinner.css("opacity", 0);
}

function refreshSources() {
    showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", sourcesRoot, true);
    xhr.onload = function () {
        try {
            var res = JSON.parse(xhr.responseText);
            if (res.success) {
                currentSources = res.content;
                updateSourcesUI();
                refreshCatalogue();
            } else {
                sourcesRefreshError();
            }
        } catch (e) {
            console.error(e);
            sourcesRefreshError();
        }
        hideSpinner();
    };
    xhr.onerror = function () {
        sourcesRefreshError();
        hideSpinner();
    };
    xhr.send();
}

function buildCatalogueURL() {
    var currentUrl = catalogueRoot + "/" + rawElement(sourcesSelect).value + "/" + searchState.page;
    var usedQuestionMark = false;
    if(valid(searchState.lastUrl)) {
        currentUrl += usedQuestionMark ? "&" : "?";
        currentUrl += "lurl=" + encodeURIComponent(searchState.lastUrl);
        usedQuestionMark = true;
    }
    if(valid(searchState.query)) {
        currentUrl += usedQuestionMark ? "&" : "?";
        currentUrl += "query=" + encodeURIComponent(searchState.query);
    }
    return currentUrl;
}
function isRefreshing() {
    return valid(currentRequest) && !currentRequest.completed;
}

function hasNextPage() {
    return !!(valid(searchState.lastUrl) && searchState.lastUrl !== "");
}

//TODO Pages and search
function refreshCatalogue(oldRequest) {
    var request;
    if (valid(oldRequest)) {
        request = oldRequest;
    } else {
        request = new Request();
    }
    if(currentRequest === request) {
        currentRequest.cancel();
    }
    request.completed = false;
    currentRequest = request;
    showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildCatalogueURL(), true);
    xhr.onload = function () {
        if (request.canceled) {
            return;
        }
        try {
            var res = JSON.parse(xhr.responseText);
            if(res.success) {
                //Clear catalogue if page 1
                if(searchState.page === 1) {
                    clearElement(mangaGrid);
                }
                //Set new search state
                searchState.lastUrl = res.lurl;
                //Add on new manga
                updateCatalogueUI(res.content);
            } else {
                catalogueRefreshError(request);
            }
        }
        catch (e) {
            console.error(e);
            catalogueRefreshError(request);
        }
        hideSpinner();
        request.completed = true;
    };
    xhr.onerror = function () {
        if (request.canceled) {
            return;
        }
        catalogueRefreshError(request);
        hideSpinner();
        request.completed = true;
    };
    xhr.send();
    return request;
}

function updateSourcesUI() {
    clearElement(sourcesSelect);
    $.each(currentSources, function (index, value) {
        sourcesSelect.append($('<option/>', {
            value: value.id,
            text : value.name
        }));
    });
}

function updateCatalogueUI(manga) {
    $.each(manga, function (index, value) {
        appendManga(value, mangaGrid, true);
    });
}

/**
 * Basic cancelable request
 **/
function Request() {
    var that = this;
    this.canceled = false;
    this.cancel = function () {
        that.canceled = true;
    };
    this.completed = false;
}

function sourcesRefreshError() {
    snackbar.showSnackbar({
        message: "Error getting sources!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            refreshSources();
        }
    });
}

function catalogueRefreshError(request) {
    snackbar.showSnackbar({
        message: "Error getting catalogue!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            refreshCatalogue(request);
        }
    });
}

function sourceLoginError(message) {
    snackbar.showSnackbar({
        message: "Error logging in (" + message + ")!",
        timeout: 2000
    });
}