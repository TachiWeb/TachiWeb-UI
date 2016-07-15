var coverRoot = apiRoot + "/cover";
var libraryRoot = apiRoot + "/library";
var librarySpinner;
var libraryWrapper;
var currentManga;
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

function updateLibrary() {
    showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", libraryRoot, true);
    xhr.onload = function() {
        try {
            currentManga = JSON.parse(xhr.responseText);
            applyAndUpdate(currentManga);
        }
        catch (e) {
            libraryUpdateError();
        }
        hideSpinner();
    };
    xhr.onerror = function() {
        libraryUpdateError();
        hideSpinner();
    };
    xhr.send();
}

function showSpinner() {
    librarySpinner.css("opacity", 1);
}

function hideSpinner() {
    librarySpinner.css("opacity", 0);
}

function buildCoverUrl(mangaId) {
    return coverRoot + "/" + mangaId;
}

function updateLibraryUI(mangas) {
    //Construct categories
    var categories = {};
    for (var i = 0; i < mangas.length; i++) {
        var manga = mangas[i];
        var mCategories = manga.categories.slice(0);
        if(mCategories.length <= 0) {
            mCategories.push("Default");
        }
        for (var a = 0; a < mCategories.length; a++) {
            var categoryName = mCategories[a];
            var category = categories[categoryName];
            if (!valid(category)) {
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
        for(i = 0; i < categoryKeys.length; i++) {
            categoryName = categoryKeys[i];
            category = categories[categoryName];
            var categorySplitter = document.createElement("div");
            categorySplitter.className = "category_header";
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

function appendManga(manga, element) {
    var card = document.createElement("div");
    card.className = "mdl-card mdl-shadow--4dp manga_card mdl-cell mdl-cell--2-col mdl-button mdl-js-button mdl-js-ripple-effect";
    var img = document.createElement("img");
    img.className = "manga_card_img";
    img.src = buildCoverUrl(manga.id);
    img.alt = manga.title;
    card.appendChild(img);
    var label = document.createElement("div");
    label.className = "manga_card_label";
    label.textContent = manga.title;
    card.appendChild(label);
    element.appendChild(card);
    componentHandler.upgradeElement(card);
    componentHandler.upgradeElement(element);
}

function libraryUpdateError() {
    snackbar.showSnackbar({
        message: "Error getting library!",
        timeout: 2000,
        actionText: "Retry",
        actionHandler: function() {
            updateLibrary();
        }
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
        if(filters.onlyUnread && manga.unread <= 0) {
            remove = true;
        }
        if(!remove && filters.text.trim !== "" && manga.title.indexOf(filters.text) <= -1) {
            remove = true;
        }
        if(remove) {
            mangas.splice(i, 1);
        }
    }
}

function setupFilters() {
    unreadCheckbox = $("#unread-chkbx");
    unreadCheckbox.change(function() {
        filters.onlyUnread = this.checked;
        applyAndUpdate(currentManga);
    });
    $("#clear_filters_btn").click(function() {
        resetFilters();
        mapFiltersToUI();
        applyAndUpdate(currentManga);
    });
    $("#manga_search").on('input',function(e){
        filters.text = $(this).val();
        applyAndUpdate(currentManga);
    });
}

function onLoad() {
    librarySpinner = $(".loading_spinner");
    libraryWrapper = $("#library_wrapper");
    setupFilters();
    updateLibrary();
}
