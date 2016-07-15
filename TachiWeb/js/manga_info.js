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

function onLoad() {
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
	setupTabs();
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