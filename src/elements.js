const mainDiv = document.createElement("div");
mainDiv.classList.add("fuzzy-tab-search-parent");
mainDiv.tabIndex = 0;

const tabList = document.createElement("ul");
tabList.classList.add("fuzzy-tab-search-tab-list");

const search = document.createElement("input");
search.classList.add("fuzzy-tab-search-search-box");
search.autofocus = true;

export { mainDiv, tabList, search };
