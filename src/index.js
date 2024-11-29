import { fuzzyMatch } from "./fuzzySearch.js";
import { mainDiv, tabList, search } from "./elements.js";

mainDiv.appendChild(tabList);

function fetchAndDisplayTabs() {
  browser.tabs.query({}, (tabs) => {
    tabList.innerHTML = ""; // Clear previous results
    const query = search.value.trim();

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

document.addEventListener("keydown", function (event) {
  // Check if the Control key is pressed and the F key is pressed
  if (event.ctrlKey && event.key === "f") {
    fetchAndDisplayTabs();
    event.preventDefault(); // Prevent the default browser action (e.g., opening the search bar)
    document.body.appendChild(mainDiv);
    console.log("test");
  }
});

// Event listener for input
search.addEventListener("input", fetchAndDisplayTabs);
