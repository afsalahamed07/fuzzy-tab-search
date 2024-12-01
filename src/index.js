import { fuzzyMatch } from "./fuzzySearch.js";
import { mainDiv, tabList, search } from "./elements.js";
import Fuse from "fuse.js";

mainDiv.appendChild(tabList);
mainDiv.appendChild(search);

const fuseOptions = {
  keys: ["title", "url"],
};

let selectedList;

function displayTabs(tabs) {
  tabList.innerHTML = ""; // Clear previous results
  const query = search.value.trim();

  // const filteredTabs = tabs.filter(
  //   (tab) => fuzzyMatch(query, tab.title) || fuzzyMatch(query, tab.url),
  // );
  //
  const fuse = new Fuse(tabs, fuseOptions);

  const filteredTabs =
    query === "" ? tabs : fuse.search(query).map((result) => result.item);

  filteredTabs.reverse();

  filteredTabs.forEach((tab, index, array) => {
    const listItem = document.createElement("li");
    listItem.classList.add("fuzzy-tab-search-tab-list-item");
    const hostname = new URL(tab.url).hostname;
    listItem.textContent = hostname + " : " + tab.title;

    if (index === array.length - 1) {
      selectedList = listItem;
      selectedList.classList.add("bg-gray-500");
    }

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

mainDiv.addEventListener("keydown", function (event) {
  // Check if the Control key is pressed and the F key is pressed
  if (event.key === "Escape") {
    document.body.removeChild(mainDiv);
  }
});

// Event listener for input
search.addEventListener("input", fetchAndDisplayTabs);

search.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    selectedList.click();
  } else if (event.ctrlKey && event.key === "p") {
    if (selectedList.previousElementSibling) {
      selectedList.classList.remove("bg-gray-500"); // Remove current selection
      selectedList = selectedList.previousElementSibling; // Update reference
      selectedList.classList.add("bg-gray-500"); // Highlight new selection
    }
  } else if (event.ctrlKey && event.key === "n") {
    // Move to the next sibling
    if (selectedList.nextElementSibling) {
      selectedList.classList.remove("bg-gray-500"); // Remove current selection
      selectedList = selectedList.nextElementSibling; // Update reference
      selectedList.classList.add("bg-gray-500"); // Highlight new selection
    }
  }
});
