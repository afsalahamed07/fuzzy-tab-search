import { TabSearchItem } from "../tab-search-item/index.js";
import styles from "./styles.css?raw";

const template = document.createElement("template");
const focusableSelector = [
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "a[href]",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

template.innerHTML = `
  <style>${styles}</style>
  <div class="backdrop"></div>
  <section class="panel" role="dialog" aria-modal="true" aria-label="Fuzzy Tab Finder">
    <div class="header">
      <strong>Fuzzy Tab Finder</strong>
    </div>
    <input class="search" type="text" placeholder="Search open tabs..." />
    <div class="list"></div>
    <div class="footer">
      <span class="hint"><span class="key">Enter</span> open</span>
      <span class="hint"><span class="key">Ctrl N/P</span> move</span> <span class="hint"><span class="key">Ctrl X</span> close tab</span>
      <span class="hint"><span class="key">Esc</span> dismiss</span>
    </div>
  </section>
`;

class TabSearchOverlay {
  constructor() {
    this.host = document.createElement("div");
    this.host.className = "fts-overlay-host";
    this.shadowRoot = this.host.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true));

    this.backdrop = this.shadowRoot.querySelector(".backdrop");
    this.panel = this.shadowRoot.querySelector(".panel");
    this.searchInput = this.shadowRoot.querySelector(".search");
    this.tabList = this.shadowRoot.querySelector(".list");
    this.restoreFocusTarget = null;
    this.previousHtmlOverflow = "";
    this.previousBodyOverflow = "";
    this.inertSiblings = [];

    this.handleTabKey = this.handleTabKey.bind(this);
    this.handleDocumentFocus = this.handleDocumentFocus.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);

    this.backdrop.addEventListener("click", () => {
      this.host.dispatchEvent(
        new CustomEvent("overlay-close", { bubbles: true, composed: true }),
      );
    });

    this.panel.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    this.panel.addEventListener("mousedown", (event) => {
      event.stopPropagation();
    });

    this.panel.addEventListener("keydown", this.handleTabKey);
  }

  get query() {
    return this.searchInput.value;
  }

  set query(value) {
    this.searchInput.value = value;
  }

  setTabs(tabs) {
    const items = tabs.map((tab) => new TabSearchItem(tab).host);

    if (items.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty";
      emptyState.textContent = "No tabs match current query.";
      this.tabList.replaceChildren(emptyState);
      return;
    }

    this.tabList.replaceChildren(...items);
  }

  open() {
    this.restoreFocusTarget = document.activeElement;
    this.previousHtmlOverflow = document.documentElement.style.overflow;
    this.previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    this.setBackgroundInert(true);
    document.addEventListener("focusin", this.handleDocumentFocus, true);
    document.addEventListener("click", this.handleDocumentClick, true);
    this.host.classList.add("is-open");
  }

  close() {
    this.host.classList.remove("is-open");
    document.removeEventListener("focusin", this.handleDocumentFocus, true);
    document.removeEventListener("click", this.handleDocumentClick, true);
    this.setBackgroundInert(false);
    document.documentElement.style.overflow = this.previousHtmlOverflow;
    document.body.style.overflow = this.previousBodyOverflow;

    if (
      this.restoreFocusTarget &&
      typeof this.restoreFocusTarget.focus === "function" &&
      this.restoreFocusTarget.isConnected
    ) {
      this.restoreFocusTarget.focus();
    }
  }

  focusSearch() {
    this.searchInput.focus();
    this.searchInput.select();
  }

  addEventListener(...args) {
    this.host.addEventListener(...args);
  }

  removeEventListener(...args) {
    this.host.removeEventListener(...args);
  }

  contains(target) {
    return this.host === target || this.host.contains(target);
  }

  handleTabKey(event) {
    if (event.key !== "Tab") {
      event.stopPropagation();
      return;
    }

    const focusableElements = this.getFocusableElements();

    if (focusableElements.length === 0) {
      event.preventDefault();
      this.focusSearch();
      return;
    }

    const currentIndex = focusableElements.indexOf(this.shadowRoot.activeElement);
    const direction = event.shiftKey ? -1 : 1;
    const nextIndex =
      currentIndex === -1
        ? event.shiftKey
          ? focusableElements.length - 1
          : 0
        : (currentIndex + direction + focusableElements.length) %
          focusableElements.length;

    event.preventDefault();
    focusableElements[nextIndex].focus();
  }

  handleDocumentFocus(event) {
    if (!this.isOpen() || this.contains(event.target)) {
      return;
    }

    this.focusSearch();
  }

  handleDocumentClick(event) {
    if (!this.isOpen() || this.contains(event.target)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.focusSearch();
  }

  getFocusableElements() {
    return Array.from(this.shadowRoot.querySelectorAll(focusableSelector));
  }

  isOpen() {
    return this.host.classList.contains("is-open");
  }

  setBackgroundInert(isInert) {
    if (!("inert" in HTMLElement.prototype)) {
      return;
    }

    if (isInert) {
      this.inertSiblings = Array.from(document.body.children)
        .filter((element) => element !== this.host)
        .map((element) => ({
          element,
          wasInert: element.inert,
        }));

      this.inertSiblings.forEach(({ element }) => {
        element.inert = true;
      });

      return;
    }

    this.inertSiblings.forEach(({ element, wasInert }) => {
      element.inert = wasInert;
    });
    this.inertSiblings = [];
  }
}

export { TabSearchOverlay };
