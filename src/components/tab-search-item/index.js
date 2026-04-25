import { tabSearchItemStyles } from "./styles.js";

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url || "unknown";
  }
}

export function createTabSearchItem(tab) {
  const host = document.createElement("div");
  const shadowRoot = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = tabSearchItemStyles;

  const button = document.createElement("button");
  button.type = "button";

  const meta = document.createElement("span");
  meta.className = "meta";

  const titleElement = document.createElement("span");
  titleElement.className = "title";

  const hostnameElement = document.createElement("span");
  hostnameElement.className = "hostname";

  const badgeElement = document.createElement("span");
  badgeElement.className = "badge";

  meta.append(titleElement, hostnameElement);
  button.append(meta, badgeElement);
  shadowRoot.append(style, button);

  host.className = "fts-tab-item";
  host.dataset.tabId = tab?.id != null ? String(tab.id) : "";

  titleElement.textContent = tab?.title || "untitled";
  hostnameElement.textContent = getHostname(tab?.url);
  badgeElement.textContent = tab?.index != null ? `#${tab.index + 1}` : "";
  button.title = `${hostnameElement.textContent} : ${titleElement.textContent}`;

  host.addEventListener("click", () => {
    if (!tab) {
      return;
    }

    host.dispatchEvent(
      new CustomEvent("tab-activate", {
        bubbles: true,
        composed: true,
        detail: { tab },
      }),
    );
  });

  return host;
}
