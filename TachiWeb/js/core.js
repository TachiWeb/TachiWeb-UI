//var apiRoot = "/api";
var apiRoot = "http://localhost:4567/api";
var snackbar;

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
