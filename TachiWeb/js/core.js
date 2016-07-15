//var apiRoot = "/api";
var apiRoot = "http://localhost:4567/api";
var coverRoot = apiRoot + "/cover";
var libraryRoot = apiRoot + "/library";
var infoRoot = apiRoot + "/manga_info";
var snackbar;

//Api functions
function buildCoverUrl(mangaId) {
    return coverRoot + "/" + mangaId;
}

//Remove all children from element
function clearElement(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

//Is a variable valid?
function valid(v) {
	return v !== undefined && v !== null;
}

function rawElement(element) {
	if(element instanceof jQuery) {
		return element[0];
	} else {
		return element;
	}
}

function mdlCheckboxCheck(checkbox, check) {
	//For some stupid reason, we need the parent label to change the checkbox!
	if(check) {
		rawElement(checkbox.parent()).MaterialCheckbox.check();
	} else {
		rawElement(checkbox.parent()).MaterialCheckbox.uncheck();
	}
}

//Catch onload
window.onload = function() {
	//Setup snackbar
	snackbar = $("#snackbar");
	if(valid(snackbar)) {
		snackbar = snackbar[0];
		if(valid(snackbar)) {
			snackbar = snackbar.MaterialSnackbar;
		}
	}
	//Call other onload listeners
	if(valid(onLoad)) {
		onLoad();
	}
};
