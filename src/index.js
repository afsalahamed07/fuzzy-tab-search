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

console.log("[fts/cs] init", {
  href: location.href,
  contentType: document.contentType,
  readyState: document.readyState,
});

const overlay = createOverlay();

console.log("[fts/cs] overlay created", {
  hasOverlay: Boolean(overlay),
});

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
  console.log("[fts/cs] activateTab", { tabIndex });

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

  console.log("[fts/cs] closeCurrentTab selected", {
    hasSelectedItem: Boolean(selectedItem),
  });

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
  console.log("[fts/cs] renderTabs", {
    query: overlay.query,
    totalTabs: state.tabs.length,
    filteredTabs: filteredTabs.length,
  });
  overlay.setTabs(filteredTabs);
  selectFirstItem(overlay.tabList);
}

async function refreshTabs() {
  console.log("[fts/cs] refreshTabs start");

  try {
    state.tabs = await getTabs();
    console.log("[fts/cs] refreshTabs success", { count: state.tabs.length });
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

  console.log("[fts/cs] openOverlay start");
  mountOverlay(overlay);
  console.log("[fts/cs] overlay mounted state", {
    inDom: document.body?.contains(overlay),
    bodyExists: Boolean(document.body),
  });
  overlay.query = "";
  await refreshTabs();
  overlay.focusSearch();
  requestAnimationFrame(() => {
    const rect = overlay.getBoundingClientRect();

    console.log("[fts/cs] overlay layout", {
      className: overlay.className,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      display: getComputedStyle(overlay).display,
      zIndex: getComputedStyle(overlay).zIndex,
    });
  });
  console.log("[fts/cs] openOverlay complete");
}

if (overlay) {
  console.log("[fts/cs] binding overlay listeners");
  overlay.searchInput.addEventListener("input", renderTabs);
  overlay.addEventListener("overlay-close", closeOverlay);
  overlay.addEventListener("tab-activate", (event) => {
    console.log("[fts/cs] tab-activate event", event.detail);
    void activateTab(event.detail.tab.index);
  });
}

bindGlobalShortcuts({ isOpen, closeOverlay });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[fts/cs] runtime message", message);

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

    console.log("[fts/cs] openOverlay diagnostics", diagnostics);

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
  console.log("[fts/cs] binding search shortcuts");
  bindSearchShortcuts(overlay.searchInput, {
    selectCurrent: () => clickSelectedItem(overlay.tabList),
    selectPrevious: () => moveSelection(overlay.tabList, "previous"),
    selectNext: () => moveSelection(overlay.tabList, "next"),
    closeCurrent: () => {
      void closeCurrentTab();
    },
  });
}
