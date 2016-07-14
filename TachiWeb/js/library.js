//TODO We have literally no error handling, maybe a snackbar or something when an error occurs?
var coverRoot = apiRoot + "/cover";
var libraryRoot = apiRoot + "/library";
var librarySpinner;
var libraryGrid;

function updateLibrary() {
	showSpinner();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", libraryRoot, true);
    xhr.onload = function () {
		try {
        	var parsed = JSON.parse(xhr.responseText);
        	updateLibraryUI(parsed);
		} catch(e) {
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
		//Make sure MDL gets these changes
        componentHandler.upgradeElement(card);
    }
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
    libraryGrid = $("#manga_grid");
	librarySpinner = $(".loading_spinner");
    updateLibrary();
}
