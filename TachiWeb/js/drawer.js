/**
 Global drawer
 **/
var drawer;
var drawerTitle;
var drawerNav;

function setupDrawer() {
    drawerTitle.text("TachiWeb");
    insertDrawerLink("Library", "index.html");
    insertDrawerLink("Catalogue", "catalogue.html");
}

function insertDrawerLink(text, link) {
    var drawerElementLink = document.createElement("a");
    drawerElementLink.className = "mdl-navigation__link";
    drawerElementLink.href = link;
    drawerElementLink.textContent = text;
    rawElement(drawerNav).appendChild(drawerElementLink);
}

$(document).ready(function(){
    drawer = $(".mdl-layout__drawer");
    drawerTitle = drawer.find(".mdl-layout-title");
    drawerNav = drawer.find(".mdl-navigation");
    setupDrawer();
});