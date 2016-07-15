var backButton;
var filterButton;
var reverseOrderBtn;
var downloadBtn;
var refreshBtn;
var refreshTooltip;
var openBrowserBtn;
var moreBtn;
var infoTab;
var chapterTab;
var fadeSpeed = 250;
var infoPanel;
var chapterPanel;
var spinner;

var infoHeaderElement;
var coverImgElement;
var headerContentElement;
var favBtn;
var favBtnIcon;
var mangaDescElement;
var mangaTitleElement;

var currentInfo;
var mangaId = QueryString.id;
var backLink = QueryString.b;
var mangaUrl;

function onLoad() {
	backButton = $(".back-button");
	filterButton = $("#filter_btn");
	reverseOrderBtn = $("#reverse_order_btn");
	downloadBtn = $("#download_btn");
	refreshBtn = $("#refresh_btn");
	refreshTooltip = $("#refresh_tooltip");
	openBrowserBtn = $("#open_browser_btn");
	moreBtn = $("#more_btn");
	infoTab = $("#info_tab");
	chapterTab = $("#chapter_tab");
	infoPanel = $("#info_panel");
	chapterPanel = $("#chapter_panel");
	spinner = $(".loading_spinner");

	infoHeaderElement = $("#info_header");
	coverImgElement = $("#cover_img");
	headerContentElement = $("#header_content");
	favBtn = $("#fav_btn");
	favBtnIcon = $("#fav_btn_icon");
	mangaDescElement = $("#manga_desc");
	mangaTitleElement = $("#manga_title");

	setupTabs();
	updateInfo();
	setupBackButton();
	setupBrowserUrlButton();
}
function setupBackButton () {
	backButton.click(function () {
		if(valid(backLink)) {
			window.location.href = backLink;
		} else {
			window.history.back();
		}
	});
}
function setupTabs() {
	infoTab.click(function() {
					  selectInfoTab();
				  });
	chapterTab.click(function() {
						selectChapterTab();
					});
}
function selectInfoTab() {
	filterButton.hide(fadeSpeed);
	reverseOrderBtn.hide(fadeSpeed);
	downloadBtn.hide(fadeSpeed);
	moreBtn.hide(fadeSpeed);
	infoPanel.addClass("selected");
	chapterPanel.removeClass("selected");
	refreshTooltip.text("Refresh Info");
}
function selectChapterTab() {
	filterButton.show(fadeSpeed);
	reverseOrderBtn.show(fadeSpeed);
	downloadBtn.show(fadeSpeed);
	moreBtn.show(fadeSpeed);
	infoPanel.removeClass("selected");
	chapterPanel.addClass("selected");
	refreshTooltip.text("Refresh Chapters");
}
function buildInfoUrl(mangaId) {
	return infoRoot + "/" + mangaId;
}
function updateInfo() {
	showSpinner();
	var xhr = new XMLHttpRequest();
	xhr.open("GET", buildInfoUrl(mangaId), true);
	xhr.onload = function() {
		try {
			currentInfo = JSON.parse(xhr.responseText);
			updateInfoUI(currentInfo);
		}
		catch (e) {
			console.error(e);
			infoUpdateError();
		}
		hideSpinner();
	};
	xhr.onerror = function() {
		infoUpdateError();
		hideSpinner();
	};
	xhr.send();
}
function updateChapters() {
	//TODO
}
function updateInfoUI(info) {
	//Set title
	mangaTitleElement.text(info.title);
	//Set cover images
	var coverUrl = buildCoverUrl(mangaId);
	infoHeaderElement.css("background", generateHeaderBackgroundCSS(coverUrl));
	//TODO Make this shorthand (does anybody know how to do this?)
	infoHeaderElement.css("background-size", "100% auto");
	coverImgElement.attr("src", coverUrl);
	//Build header content
	var headerContentArray = [];
	if(valid(info.author)) {
		headerContentArray.push(generateHeaderEntry("Author", info.author));
	}
	if(valid(info.artist)) {
		headerContentArray.push(generateHeaderEntry("Artist", info.artist));
	}
	headerContentArray.push(generateHeaderEntry("Chapters", info.chapters));
	headerContentArray.push(generateHeaderEntry("Status", info.status));
	if(valid(info.source)) {
		headerContentArray.push(generateHeaderEntry("Source", info.source));
	}
	if(valid(info.genres)) {
		headerContentArray.push(generateHeaderEntry("Genres", info.genres))
	}
	headerContentElement.html(headerContentArray.join("<br>"));
	//Set description
	if(valid(info.description)) {
		mangaDescElement.html("<strong>Description</strong><br>" + info.description);
	}
	//Set favorite
	if(info.favorite) {
		favBtnIcon.html("turned_in");
	} else {
		favBtnIcon.html("turned_in_not");
	}
	if(valid(info.url) && info.url !== "") {
		openBrowserBtn.show();
		mangaUrl = info.url;
	} else {
		openBrowserBtn.hide();
	}
}
function setupBrowserUrlButton() {
	openBrowserBtn.click(function() {
		if(valid(mangaUrl)) {
			openInNewTab(mangaUrl);
		}
	});
}
function generateHeaderEntry(subject, description) {
	return "<strong>" + subject + "</strong>&nbsp;&nbsp;" + description;
}
function generateHeaderBackgroundCSS(url) {
	return "linear-gradient(rgba(255, 255, 255, 0.75),rgba(255, 255, 255, 0.75)),url(\"" + url + "\")"
}
function infoUpdateError() {
	snackbar.showSnackbar({
		message: "Error getting manga info!",
		timeout: 2000,
		actionText: "Retry",
		actionHandler: function() {
			updateInfo();
		}
	});
}
function chapterUpdateError() {
	snackbar.showSnackbar({
		message: "Error getting chapters!",
		timeout: 2000,
		actionText: "Retry",
		actionHandler: function() {
			updateChapters();
		}
	});
}
function showSpinner() {
	spinner.css("opacity", 1);
}

function hideSpinner() {
	spinner.css("opacity", 0);
}