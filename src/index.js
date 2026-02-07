import {
  createOverlay,
  isOverlayMounted,
  mountOverlay,
  unmountOverlay,
} from "./dom.js";
import { formatTabLabel } from "./format.js";
import { bindGlobalShortcuts, bindSearchShortcuts } from "./keyboard.js";
import { getTabs, highlightTab } from "./messages.js";
import {
  clickSelectedItem,
  moveSelection,
  selectFirstItem,
} from "./navigation.js";
import { filterTabs } from "./search.js";

const overlay = createOverlay();

const state = {
  tabs: [],
};

function isOpen() {
  return isOverlayMounted(overlay);
}

function closeOverlay() {
  unmountOverlay(overlay);
}

function activateTab(tabIndex) {
  highlightTab(tabIndex);
  closeOverlay();
}

function createTabItem(tab) {
  const item = document.createElement("li");
  item.classList.add("fuzzy-tab-search-tab-list-item");
  item.textContent = formatTabLabel(tab);
  item.addEventListener("click", () => activateTab(tab.index));
  return item;
}

function renderTabs() {
  const filteredTabs = filterTabs(state.tabs, overlay.searchInput.value);
  overlay.tabList.replaceChildren(...filteredTabs.map(createTabItem));
  selectFirstItem(overlay.tabList);
}

async function refreshTabs() {
  try {
    state.tabs = await getTabs();
  } catch (error) {
    state.tabs = [];
    console.error("Failed to fetch tabs:", error);
  }

  renderTabs();
}

async function openOverlay() {
  mountOverlay(overlay);
  overlay.searchInput.value = "";
  await refreshTabs();
  overlay.searchInput.focus();
}

overlay.searchInput.addEventListener("input", renderTabs);

bindGlobalShortcuts({
  isOpen,
  openOverlay,
  closeOverlay,
});

bindSearchShortcuts(overlay.searchInput, {
  selectCurrent: () => clickSelectedItem(overlay.tabList),
  selectPrevious: () => moveSelection(overlay.tabList, "previous"),
  selectNext: () => moveSelection(overlay.tabList, "next"),
});
