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

export class TabSearchItem {
  constructor(tab) {
    this.tab = tab;
    this.host = document.createElement("div");
    this.shadowRoot = this.host.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true));

    this.button = this.shadowRoot.querySelector("button");
    this.titleElement = this.shadowRoot.querySelector(".title");
    this.hostnameElement = this.shadowRoot.querySelector(".hostname");
    this.badgeElement = this.shadowRoot.querySelector(".badge");

    this.host.className = "fts-tab-item";
    this.host.dataset.tabId = tab?.id != null ? String(tab.id) : "";

    this.titleElement.textContent = tab?.title || "untitled";
    this.hostnameElement.textContent = getHostname(tab?.url);
    this.badgeElement.textContent = tab?.index != null ? `#${tab.index + 1}` : "";
    this.button.title = `${this.hostnameElement.textContent} : ${this.titleElement.textContent}`;

    this.host.addEventListener("click", () => {
      if (!this.tab) {
        return;
      }

      this.host.dispatchEvent(
        new CustomEvent("tab-activate", {
          bubbles: true,
          composed: true,
          detail: { tab: this.tab },
        }),
      );
    });
  }
}
