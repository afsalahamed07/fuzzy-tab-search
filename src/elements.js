const mainDiv = document.createElement("div");
mainDiv.classList.add("main");

const tabList = document.createElement("ul");
tabList.classList.add("tab-list");

const search = document.createElement("input");
search.classList.add("search-box");
search.autofocus = true;

export { mainDiv, tabList, search };
