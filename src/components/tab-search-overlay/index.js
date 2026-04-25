import { createTabSearchItem } from "../tab-search-item/index.js";
import { tabSearchOverlayStyles } from "./styles.js";

export function createTabSearchOverlay() {
  const host = document.createElement("div");
  const shadowRoot = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = tabSearchOverlayStyles;

  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";

  const panel = document.createElement("section");
  panel.className = "panel";

  const header = document.createElement("div");
  header.className = "header";
  header.innerHTML =
    "<strong>Fuzzy Tab Finder</strong><span>Rose Pine Moon</span>";

  const searchInput = document.createElement("input");
  searchInput.className = "search";
  searchInput.type = "text";
  searchInput.placeholder = "Search open tabs...";

  const tabList = document.createElement("div");
  tabList.className = "list";

  const footer = document.createElement("div");
  footer.className = "footer";
  footer.innerHTML = [
    '<span class="hint"><span class="key">Enter</span> open</span>',
    '<span class="hint"><span class="key">Ctrl N/P</span> move</span>',
    '<span class="hint"><span class="key">Ctrl X</span> close tab</span>',
    '<span class="hint"><span class="key">Esc</span> dismiss</span>',
  ].join("");

  panel.append(header, searchInput, tabList, footer);
  shadowRoot.append(style, backdrop, panel);

  host.className = "fts-overlay-host";

  backdrop.addEventListener("click", () => {
    host.dispatchEvent(
      new CustomEvent("overlay-close", { bubbles: true, composed: true }),
    );
  });

  Object.defineProperties(host, {
    searchInput: {
      value: searchInput,
      enumerable: true,
    },
    tabList: {
      value: tabList,
      enumerable: true,
    },
    query: {
      get() {
        return searchInput.value;
      },
      set(value) {
        searchInput.value = value;
      },
      enumerable: true,
    },
  });

  host.setTabs = (tabs) => {
    const items = tabs.map((tab) => createTabSearchItem(tab));

    if (items.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty";
      emptyState.textContent = "No tabs match current query.";
      tabList.replaceChildren(emptyState);
      return;
    }

    tabList.replaceChildren(...items);
  };

  host.open = () => {
    host.classList.add("is-open");
  };

  host.close = () => {
    host.classList.remove("is-open");
  };

  host.focusSearch = () => {
    searchInput.focus();
    searchInput.select();
  };

  return host;
}
