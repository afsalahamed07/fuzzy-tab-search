import openCenteredPopup from "./window.js";

// Helper function for fuzzy matching
function fuzzyMatch(query, text) {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  let queryIndex = 0;
  for (let char of textLower) {
    if (char === queryLower[queryIndex]) {
      queryIndex++;
    }
    if (queryIndex === queryLower.length) {
      return true;
    }
  }
  return false;
}

// Fetch tabs and display them
function fetchAndDisplayTabs() {
  browser.tabs.query({}, (tabs) => {
    const tabList = document.getElementById("tab-list");
    tabList.innerHTML = ""; // Clear previous results

    const searchBox = document.getElementById("searchBox");
    const query = searchBox.value.trim();

    const filteredTabs = tabs.filter(
      (tab) => fuzzyMatch(query, tab.title) || fuzzyMatch(query, tab.url),
    );

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
