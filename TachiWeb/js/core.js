//var apiRoot = "/api";
var apiRoot = "http://localhost:4567/api";
function clearElement(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}
//Update material JS
$(window).resize(function() {
    componentHandler.upgradeAllRegistered();
});