var librarySpinner;
var libraryWrapper;
var currentManga = [];
var unreadCheckbox;
var filters;
function resetFilters() {
    filters = {
        onlyUnread: false,
        text: ""
    };
}
function mapFiltersToUI() {
    mdlCheckboxCheck(unreadCheckbox, filters.onlyUnread);
}
resetFilters();

function onLoad() {
    librarySpinner = $(".loading_spinner");
    libraryWrapper = $("#library_wrapper");
    setupFilters();
    setupUpdateButton();
    updateLibrary();
}

function updateLibrary() {
    showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", libraryRoot, true);
    xhr.onload = function () {
        try {
            currentManga = JSON.parse(xhr.responseText);
            applyAndUpdate(currentManga);
        }
        catch (e) {
            console.error(e);
            libraryUpdateError();
        }
        hideSpinner();
    };
    xhr.onerror = function () {
        libraryUpdateError();
        hideSpinner();
    };
    xhr.send();
}
function setupUpdateButton() {
    $("#refresh_btn").click(function () {
        updateServerLibrary();
    });
}
function updateServerLibrary() {
    showSpinner();
    var currentOnComplete = function () {
        hideSpinner();
        updateLibrary();
    };
    for (var i = 0; i < currentManga.length; i++) {
        var manga = currentManga[i];
        currentOnComplete = function (manga, lastOnComplete) {
            return function () {
                updateManga(manga, lastOnComplete);
            };
        }(manga, currentOnComplete);
    }
    currentOnComplete();
}
function updateManga(manga, onComplete) {
    console.log("Updating: " + manga.title + " (" + manga.id + ")");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", buildMangaUpdateURL(manga.id), true);
    xhr.onload = function () {
        try {
            var res = JSON.parse(xhr.responseText);
            if (!res.success) {
                mangaUpdateError(manga.title);
            }
        }
        catch (e) {
            console.error(e);
            mangaUpdateError(manga.title);
        }
        onComplete();
    };
    xhr.onerror = function () {
        mangaUpdateError(manga.title);
        onComplete();
    };
    xhr.send();
}

function buildMangaUpdateURL(mangaId) {
    return updateRoot + "/" + mangaId + "/CHAPTERS";
}

function showSpinner() {
    librarySpinner.css("opacity", 1);
}

function hideSpinner() {
    librarySpinner.css("opacity", 0);
}

function updateLibraryUI(mangas) {
    //Construct categories
    var categories = {};
    for (var i = 0; i < mangas.length; i++) {
        var manga = mangas[i];
        var mCategories = manga.categories.slice(0);
        if (mCategories.length <= 0) {
            mCategories.push("Default");
        }
        for (var a = 0; a < mCategories.length; a++) {
            var categoryName = mCategories[a];
            var category = categories[categoryName];
            if (!category) {
                category = [];
                categories[categoryName] = category;
            }
            category.push(manga);
        }
    }
    //Remove old entries
    clearElement(libraryWrapper[0]);
    var categoryKeys = Object.keys(categories);
    if (categoryKeys.length <= 1) {
        //Append directly if we don't have tabs
        appendMangas(mangas, libraryWrapper[0]);
    } else {
        for (i = 0; i < categoryKeys.length; i++) {
            categoryName = categoryKeys[i];
            category = categories[categoryName];
            var categorySplitter = document.createElement("div");
            categorySplitter.className = "list_header";
            categorySplitter.textContent = categoryName;
            libraryWrapper[0].appendChild(categorySplitter);
            //Actually append mangas
            appendMangas(category, libraryWrapper[0]);
        }
    }
    //Make sure MDL gets content changes
    componentHandler.upgradeElement(libraryWrapper[0]);
}

function appendMangas(mangas, rootElement) {
    var libraryGrid = createGrid();
    rootElement.appendChild(libraryGrid);
    for (var i = 0; i < mangas.length; i++) {
        appendManga(mangas[i], libraryGrid);
    }
    componentHandler.upgradeElement(libraryGrid);
}

function createGrid() {
    var grid = document.createElement("div");
    grid.className = "mdl-grid";
    return grid;
}

function libraryUpdateError() {
    snackbar.showSnackbar({
        message: "Error getting library!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function () {
            updateLibrary();
        }
    });
}

function mangaUpdateError(manga) {
    snackbar.showSnackbar({
        message: "Error updating manga: '" + manga + "'!",
        timeout: 500
    });
}

function applyAndUpdate(mangas) {
    var clonedMangas = mangas.slice(0);
    applyFilters(clonedMangas);
    updateLibraryUI(clonedMangas);
}

function applyFilters(mangas) {
    for (var i = mangas.length - 1; i >= 0; i--) {
        var manga = mangas[i];
        var remove = false;
        if (filters.onlyUnread && manga.unread <= 0) {
            remove = true;
        }
        if (!remove && filters.text.trim !== "" && manga.title.toLowerCase().indexOf(filters.text.toLowerCase()) <= -1) {
            remove = true;
        }
        if (remove) {
            mangas.splice(i, 1);
        }
    }
}

function setupFilters() {
    unreadCheckbox = $("#unread-chkbx");
    unreadCheckbox.change(function () {
        filters.onlyUnread = this.checked;
        applyAndUpdate(currentManga);
    });
    $("#clear_filters_btn").click(function () {
        resetFilters();
        mapFiltersToUI();
        applyAndUpdate(currentManga);
    });
    $("#manga_search").on('input', function () {
        filters.text = $(this).val();
        applyAndUpdate(currentManga);
    });
}