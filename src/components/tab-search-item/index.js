import styles from "./styles.css?raw";

const template = document.createElement("template");
template.innerHTML = `
  <style>${styles}</style>
  <button type="button">
    <span class="meta">
      <span class="title"></span>
      <span class="hostname"></span>
    </span>
    <span class="badge"></span>
  </button>
`;

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
  shadowRoot.append(template.content.cloneNode(true));

  const button = shadowRoot.querySelector("button");
  const titleElement = shadowRoot.querySelector(".title");
  const hostnameElement = shadowRoot.querySelector(".hostname");
  const badgeElement = shadowRoot.querySelector(".badge");

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
