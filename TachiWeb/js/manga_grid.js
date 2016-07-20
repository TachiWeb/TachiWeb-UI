/** Shared Manga Grid lib that allows displaying Manga in a grid format **/
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
    $(card).click(function() {
        var currentUrl = window.location.href;
        window.location.href = "manga_info.html?id=" + manga.id + "&b=" + encodeURIComponent(currentUrl);
    });
    element.appendChild(card);
    componentHandler.upgradeElement(card);
    componentHandler.upgradeElement(element);
}
