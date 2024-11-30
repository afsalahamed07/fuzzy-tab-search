import { fuzzyMatch } from "./fuzzySearch.js";
import { mainDiv, tabList, search } from "./elements.js";

mainDiv.appendChild(tabList);
mainDiv.appendChild(search);

function displayTabs(tabs) {
  tabList.innerHTML = ""; // Clear previous results
  const query = search.value.trim();

  const filteredTabs = tabs.filter(
    (tab) => fuzzyMatch(query, tab.url) || fuzzyMatch(query, tab.url),
  );

  filteredTabs.reverse();

  console.log(filteredTabs);

  filteredTabs.forEach((tab) => {
    const listItem = document.createElement("li");
    const hostname = new URL(tab.url).hostname;

    listItem.textContent = hostname + " : " + tab.title;
    console.log(hostname);

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

document.addEventListener("keydown", function (event) {
  // Check if the Control key is pressed and the F key is pressed
  if (event.ctrlKey && event.key === "f") {
    search.value = "";
    fetchAndDisplayTabs();
    event.preventDefault(); // Prevent the default browser action (e.g., opening the search bar)
    document.body.appendChild(mainDiv);
    search.focus();
    console.log("test");
  }
});

document.addEventListener("keydown", function (event) {
  // Check if the Control key is pressed and the F key is pressed
  if (event.ctrlKey && event.key === "q") {
    document.body.removeChild(mainDiv);
  }
});

// Event listener for input
search.addEventListener("input", fetchAndDisplayTabs);
