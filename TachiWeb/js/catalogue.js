var spinner;
var currentCatalogue = [];
var unreadCheckbox;
var searchState;
function resetSearchState() {
    searchState = {
        query: null,
        lastUrl: null,
        page: 0
    };
}
resetSearchState();

function onLoad() {
    spinner = $(".loading_spinner");
    refreshCatalogue();
}

function showSpinner() {
    spinner.css("opacity", 1);
}

function hideSpinner() {
    spinner.css("opacity", 0);
}

function refreshCatalogue(oldRequest) {
    //TODO
    var request;
    if(valid(oldRequest)) {
        request = oldRequest;
    } else {
        request = new Request();
    }
    showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", /* TODO URL */"", true);
    xhr.onload = function() {
        if(request.canceled) {
            return;
        }
        try {
            var res = JSON.parse(xhr.responseText);
            applyAndUpdate(currentManga);
        }
        catch (e) {
            console.error(e);
            catalogueRefreshError(request);
        }
        hideSpinner();
    };
    xhr.onerror = function() {
        if(request.canceled) {
            return;
        }
        catalogueRefreshError(request);
        hideSpinner();
    };
    xhr.send();
    return request;
}

function updateCatalogueUI() {
    
}

/**
 * Basic cancelable request
 **/
function Request() {
    var that = this;
    this.canceled = false;
    this.cancel = function() {
        that.canceled = true;
    }
}

function catalogueRefreshError(request) {
    snackbar.showSnackbar({
        message: "Error getting catalogue!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function() {
            refreshCatalogue(request);
        }
    });
}