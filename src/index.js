import {
  createOverlay,
  isOverlayMounted,
  mountOverlay,
  unmountOverlay,
} from "./dom.js";
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
  if (!overlay) {
    console.warn("[fts/cs] closeCurrentTab skipped: no overlay");
    return;
  }

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
    overlay.focusSearch();
  } catch (error) {
    console.error("Failed to close tab:", error);
  }
}

function renderTabs() {
  if (!overlay) {
    console.warn("[fts/cs] renderTabs skipped: no overlay");
    return;
  }

  const filteredTabs = filterTabs(state.tabs, overlay.query);
  overlay.setTabs(filteredTabs);
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
  if (!overlay) {
    console.warn("[fts/cs] openOverlay skipped: no overlay");
    return;
  }

  mountOverlay(overlay);
  overlay.query = "";
  await refreshTabs();
  overlay.focusSearch();
}

if (overlay) {
  overlay.searchInput.addEventListener("input", renderTabs);
  overlay.addEventListener("overlay-close", closeOverlay);
  overlay.addEventListener("tab-activate", (event) => {
    void activateTab(event.detail.tab.index);
  });
}

bindGlobalShortcuts({ isOpen, closeOverlay });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openOverlay") {
    const diagnostics = {
      hasOverlay: Boolean(overlay),
      isHtmlDocument: document instanceof HTMLDocument,
      hasShadowDom:
        typeof Element !== "undefined" && "attachShadow" in Element.prototype,
      contentType: document.contentType,
      readyState: document.readyState,
      bodyExists: Boolean(document.body),
      href: location.href,
    };

    void openOverlay()
      .then(() => {
        sendResponse({
          ...diagnostics,
          opened: true,
          overlayMounted: Boolean(overlay && document.body?.contains(overlay)),
        });
      })
      .catch((error) => {
        console.error("[fts/cs] openOverlay failed", error);
        sendResponse({
          ...diagnostics,
          opened: false,
          error: String(error),
        });
      });

    return true;
  }

  return undefined;
});

if (overlay) {
  bindSearchShortcuts(overlay.searchInput, {
    selectCurrent: () => clickSelectedItem(overlay.tabList),
    selectPrevious: () => moveSelection(overlay.tabList, "previous"),
    selectNext: () => moveSelection(overlay.tabList, "next"),
    closeCurrent: () => {
      void closeCurrentTab();
    },
  });
}
