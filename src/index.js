import { fuzzyMatch } from "./fuzzySearch.js";
import { mainDiv, tabList, search } from "./elements.js";

mainDiv.appendChild(tabList);
mainDiv.appendChild(search);

function displayTabs(tabs) {
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
      browser.runtime.sendMessage({
        action: "highlightTab",
        tabIndex: tab.index,
      });

      document.body.removeChild(mainDiv);
    });

    tabList.appendChild(listItem);
  });
}

function fetchAndDisplayTabs() {
  const searchQuery = search.value;

  // Request tab information from the background script
  browser.runtime.sendMessage({ action: "getTabs" }, (tabs) => {
    if (tabs) {
      displayTabs(tabs, searchQuery);
    } else {
      console.error("Failed to fetch tabs.");
    }
  });
}

console.log("Hello");

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
