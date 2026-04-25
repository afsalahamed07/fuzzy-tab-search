import { createTabSearchItem } from "../tab-search-item/index.js";
import styles from "./styles.css?raw";

const template = document.createElement("template");
template.innerHTML = `
  <style>${styles}</style>
  <div class="backdrop"></div>
  <section class="panel">
    <div class="header">
      <strong>Fuzzy Tab Finder</strong>
      <span>Rose Pine Moon</span>
    </div>
    <input class="search" type="text" placeholder="Search open tabs..." />
    <div class="list"></div>
    <div class="footer">
      <span class="hint"><span class="key">Enter</span> open</span>
      <span class="hint"><span class="key">Ctrl N/P</span> move</span>
      <span class="hint"><span class="key">Ctrl X</span> close tab</span>
      <span class="hint"><span class="key">Esc</span> dismiss</span>
    </div>
  </section>
`;

export function createTabSearchOverlay() {
  const host = document.createElement("div");
  const shadowRoot = host.attachShadow({ mode: "open" });
  shadowRoot.append(template.content.cloneNode(true));

  const backdrop = shadowRoot.querySelector(".backdrop");
  const searchInput = shadowRoot.querySelector(".search");
  const tabList = shadowRoot.querySelector(".list");

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
