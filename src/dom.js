import { TabSearchOverlay } from "./components/tab-search-overlay/index.js";

/**
 * returns a new overlay element or null if the environment is not supported
 * @returns {TabSearchOverlay|null}
 */
export function createOverlay() {
  const isHtmlDocument = document instanceof HTMLDocument;
  const hasShadowDom =
    typeof Element !== "undefined" && "attachShadow" in Element.prototype;

  if (!isHtmlDocument || !hasShadowDom) {
    console.warn("[fts/dom] createOverlay skipped");
    return null;
  }

  return new TabSearchOverlay();
}

export function isOverlayMounted(overlay) {
  if (!overlay) {
    return false;
  }

  return document.body.contains(overlay.host);
}

export function mountOverlay(overlay) {
  if (!overlay) {
    console.warn("[fts/dom] mount skipped: no overlay");
    return;
  }

  if (!isOverlayMounted(overlay)) {
    document.body.appendChild(overlay.host);
  }

  overlay.open();
}

export function unmountOverlay(overlay) {
  if (!overlay) {
    console.warn("[fts/dom] unmount skipped: no overlay");
    return;
  }

  if (isOverlayMounted(overlay)) {
    overlay.close();
    document.body.removeChild(overlay.host);
  }
}
