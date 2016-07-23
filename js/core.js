// var apiRoot = "/api";
var apiRoot = "http://localhost:4567/api";
var coverRoot = apiRoot + "/cover";
var libraryRoot = apiRoot + "/library";
var infoRoot = apiRoot + "/manga_info";
var chaptersRoot = apiRoot + "/chapters";
var pageCountRoot = apiRoot + "/page_count";
var restoreRoot = apiRoot + "/restore_file";
var backupRoot = apiRoot + "/backup";
var faveRoot = apiRoot + "/fave";
var readingStatusRoot = apiRoot + "/reading_status";
var updateRoot = apiRoot + "/update";
var sourcesRoot = apiRoot + "/sources";
var catalogueRoot = apiRoot + "/catalogue";
var snackbar;
var QueryString = function () {
	// This function is anonymous, is executed immediately and
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			query_string[pair[0]] = [query_string[pair[0]], decodeURIComponent(pair[1])];
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
}();

//Api functions
function buildCoverUrl(mangaId) {
    return coverRoot + "/" + mangaId;
}

//Remove all children from element
function clearElement(myNode) {
    while (rawElement(myNode).firstChild) {
        rawElement(myNode).removeChild(rawElement(myNode).firstChild);
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

function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
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
