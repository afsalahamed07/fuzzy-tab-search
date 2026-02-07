function createOverlayElement(className, tagName) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  return element;
}

export function createOverlay() {
  const container = createOverlayElement("fuzzy-tab-search-parent", "div");
  container.tabIndex = 0;

  const tabList = createOverlayElement("fuzzy-tab-search-tab-list", "ul");

  const searchInput = createOverlayElement(
    "fuzzy-tab-search-search-box",
    "input",
  );
  searchInput.autofocus = true;
  searchInput.placeholder = "Search open tabs...";

  container.appendChild(searchInput);
  container.appendChild(tabList);

  return { container, tabList, searchInput };
}

export function isOverlayMounted(overlay) {
  return document.body.contains(overlay.container);
}

export function mountOverlay(overlay) {
  if (!isOverlayMounted(overlay)) {
    document.body.appendChild(overlay.container);
  }
}

export function unmountOverlay(overlay) {
  if (isOverlayMounted(overlay)) {
    document.body.removeChild(overlay.container);
  }
}
