var spinner;
var sourcesSelect;
var currentSources = [];
var searchState;
var mangaGrid;
var currentRequest = null;
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
    setupSourcesSelect();
    refreshSources();
}

function setupSourcesSelect() {
    sourcesSelect.change(function() {
        refreshCatalogue();
    });
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
        currentUrl += "lurl=" + searchState.lastUrl;
        usedQuestionMark = true;
    }
    if(valid(searchState.query)) {
        currentUrl += usedQuestionMark ? "&" : "?";
        currentUrl += "query=" + searchState.query;
    }
    return currentUrl;
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
    };
    xhr.onerror = function () {
        if (request.canceled) {
            return;
        }
        catalogueRefreshError(request);
        hideSpinner();
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
        appendManga(value, mangaGrid);
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
    }
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