import { createTabSearchOverlay } from "./components/tab-search-overlay/index.js";

export function createOverlay() {
  const isHtmlDocument = document instanceof HTMLDocument;
  const hasShadowDom = typeof Element !== "undefined" && "attachShadow" in Element.prototype;

  console.log("[fts/dom] createOverlay checks", {
    isHtmlDocument,
    hasShadowDom,
    contentType: document.contentType,
    href: location.href,
  });

  if (!isHtmlDocument || !hasShadowDom) {
    console.warn("[fts/dom] createOverlay skipped");
    return null;
  }

  console.log("[fts/dom] createOverlay element");
  return createTabSearchOverlay();
}

export function isOverlayMounted(overlay) {
  if (!overlay) {
    return false;
  }

  return document.body.contains(overlay);
}

export function mountOverlay(overlay) {
  if (!overlay) {
    console.warn("[fts/dom] mount skipped: no overlay");
    return;
  }

  if (!isOverlayMounted(overlay)) {
    console.log("[fts/dom] append overlay");
    document.body.appendChild(overlay);
  }

  console.log("[fts/dom] open overlay");
  overlay.open();
}

export function unmountOverlay(overlay) {
  if (!overlay) {
    console.warn("[fts/dom] unmount skipped: no overlay");
    return;
  }

  if (isOverlayMounted(overlay)) {
    console.log("[fts/dom] remove overlay");
    overlay.close();
    document.body.removeChild(overlay);
  }
}
