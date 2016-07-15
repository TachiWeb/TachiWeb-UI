var coverRoot = apiRoot + "/cover";
var libraryRoot = apiRoot + "/library";
var librarySpinner;
var libraryWrapper;
var libraryTabsParent;
var libraryTabs;

function updateLibrary() {
    showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", libraryRoot, true);
    xhr.onload = function() {
        try {
            var parsed = JSON.parse(xhr.responseText);
            updateLibraryUI(parsed);
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

function showTabs() {
    if(!libraryTabsParent[0].contains(libraryTabs[0])) {
        libraryTabsParent[0].appendChild(libraryTabs[0]);
    }
}

function hideTabs() {
    if(libraryTabsParent[0].contains(libraryTabs[0])) {
        libraryTabsParent[0].removeChild(libraryTabs[0]);
    }
}

function updateLibraryUI(mangas) {
    //Construct categories
    var categories = {};
    for (var i = 0; i < mangas.length; i++) {
        var manga = mangas[i];
        for (var a = 0; a < manga.categories.length; a++) {
            var categoryName = manga.categories[a];
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
    clearElement(libraryTabs[0]);
    var categoryKeys = Object.keys(categories);
    if (categoryKeys.length <= 1) {
        //Append directly if we don't have tabs
        appendMangas(mangas, libraryWrapper[0]);
    } else {
        for(i = 0; i < categoryKeys.length; i++) {
            categoryName = categoryKeys[i];
            category = categories[categoryName];
            var categoryId = "category-tab-" + i;
            //Generate tabs
            var categoryTab = document.createElement("a");
            categoryTab.className = "mdl-layout__tab";
            //First tab is active
            if(i === 0) {
                categoryTab.className += " is-active";
            }
            categoryTab.href = "#" + categoryId;
            categoryTab.textContent = categoryName;
            libraryTabs[0].appendChild(categoryTab);
            //Generate content
            var categoryPanel = document.createElement("div");
            categoryPanel.className = "mdl-tabs__panel";
            //First panel is active
            if(i === 0) {
                categoryPanel.className += " is-active";
            }
            categoryPanel.id = categoryId;
            libraryWrapper[0].appendChild(categoryPanel);
            //Actually append mangas
            appendMangas(category, categoryPanel);
        }
        //Make sure MDL gets tab changes
        componentHandler.upgradeElement(libraryTabs[0]);
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

function onLoad() {
    librarySpinner = $(".loading_spinner");
    libraryWrapper = $("#library_wrapper");
    libraryTabs = $("#library_tabs");
    libraryTabsParent = libraryTabs.parent();
    updateLibrary();
}
