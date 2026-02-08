import {
  createOverlay,
  isOverlayMounted,
  mountOverlay,
  unmountOverlay,
} from "./dom.js";
import { formatTabLabel } from "./format.js";
import { bindGlobalShortcuts, bindSearchShortcuts } from "./keyboard.js";
import {
  closeTab as closeTabById,
  getTabs,
  highlightTab as highlightTabByIndex,
} from "./messages.js";
import {
  clickSelectedItem,
  getSelectedItem,
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

async function activateTab(tabIndex) {
  try {
    highlightTabByIndex(tabIndex);
    closeOverlay();
  } catch (error) {
    console.error("Failed to activate tab:", error);
  }
}

async function closeCurrentTab() {
  const selectedItem = getSelectedItem(overlay.tabList);

  if (!selectedItem) {
    return;
  }

  const tabId = Number(selectedItem.dataset.tabId);

  if (Number.isNaN(tabId)) {
    return;
  }

  try {
    await closeTabById(tabId);
    await refreshTabs();
    overlay.searchInput.focus();
  } catch (error) {
    console.error("Failed to close tab:", error);
  }
}

function createTabItem(tab) {
  const item = document.createElement("li");
  item.classList.add("fuzzy-tab-search-tab-list-item");
  item.dataset.tabId = String(tab.id);
  item.textContent = formatTabLabel(tab);
  item.addEventListener("click", () => {
    void activateTab(tab.index);
  });
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
  closeCurrent: () => {
    void closeCurrentTab();
  },
});
