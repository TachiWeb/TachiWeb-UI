var coverRoot = apiRoot + "/cover";
var libraryRoot = apiRoot + "/library";
var libraryGrid;

function updateLibrary() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", libraryRoot, true);
    xhr.onload = function () {
        var parsed = JSON.parse(xhr.responseText);
        updateLibraryUI(parsed)
    };
    xhr.send();
}

function buildCoverUrl(mangaId) {
    return coverRoot + "/" + mangaId;
}

function updateLibraryUI(mangas) {
    clearElement(libraryGrid[0]);
    for (var i = 0; i < mangas.length; i++) {
        var manga = mangas[i];
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
        libraryGrid[0].appendChild(card);
        componentHandler.upgradeElement(card);
    }
}
window.onload = function() {
    libraryGrid = $("#manga_grid");
    updateLibrary();
};