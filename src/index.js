import { fuzzyMatch } from "./fuzzySearch.js";

const tabList = document.getElementById("tab-list");
const searchBox = document.getElementById("searchBox");
const higlighted = document.getElementById("highlighted");

function fetchAndDisplayTabs() {
  browser.tabs.query({}, (tabs) => {
    tabList.innerHTML = ""; // Clear previous results
    const query = searchBox.value.trim();

    const filteredTabs = tabs.filter(
      (tab) => fuzzyMatch(query, tab.title) || fuzzyMatch(query, tab.url),
    );

    filteredTabs.reverse();

    console.log(filteredTabs);

    filteredTabs.forEach((tab) => {
      const listItem = document.createElement("li");
      listItem.textContent = tab.title;

      listItem.addEventListener("click", () => {
        chrome.tabs.highlight({ tabs: tab.index }, () => {
          console.log("Switched to tab:", tab.title);
        });
      });

      tabList.appendChild(listItem);
    });
  });
}

// Event listener for input
document
  .getElementById("searchBox")
  .addEventListener("input", fetchAndDisplayTabs);

// Initial tab loading
document.addEventListener("DOMContentLoaded", fetchAndDisplayTabs);
