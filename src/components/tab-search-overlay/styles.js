export const tabSearchOverlayStyles = `
  :host {
    --fts-base: #232136;
    --fts-surface: #2a273f;
    --fts-overlay: #393552;
    --fts-muted: #6e6a86;
    --fts-subtle: #908caa;
    --fts-text: #e0def4;
    --fts-love: #eb6f92;
    --fts-gold: #f6c177;
    --fts-rose: #ea9a97;
    --fts-pine: #3e8fb0;
    --fts-foam: #9ccfd8;
    --fts-iris: #c4a7e7;
    --fts-highlight-low: #2a283e;
    --fts-highlight-med: #44415a;
    --fts-highlight-high: #56526e;

    position: fixed;
    inset: 0;
    z-index: 999999;
    display: none;
    place-items: center;
    padding: 24px;
    box-sizing: border-box;
    font-family: "JetBrains Mono", "SFMono-Regular", Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
  }

  :host(.is-open) {
    display: grid;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--fts-base) 76%, transparent);
    backdrop-filter: blur(8px);
  }

  .panel {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: min(960px, 100%);
    height: min(560px, calc(100vh - 48px));
    padding: 16px;
    border: 1px solid color-mix(in srgb, var(--fts-iris) 18%, var(--fts-highlight-high));
    border-radius: 18px;
    background:
      radial-gradient(circle at top right, color-mix(in srgb, var(--fts-love) 14%, transparent), transparent 28%),
      radial-gradient(circle at top left, color-mix(in srgb, var(--fts-pine) 16%, transparent), transparent 32%),
      linear-gradient(180deg, color-mix(in srgb, var(--fts-overlay) 92%, black), var(--fts-base));
    color: var(--fts-text);
    box-shadow:
      0 30px 90px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: var(--fts-subtle);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .header strong {
    color: var(--fts-rose);
    font-weight: 600;
  }

  .search {
    box-sizing: border-box;
    width: 100%;
    padding: 14px 16px;
    border: 1px solid var(--fts-highlight-high);
    border-radius: 14px;
    background: color-mix(in srgb, var(--fts-surface) 84%, black);
    color: var(--fts-text);
    font: inherit;
  }

  .search::placeholder {
    color: var(--fts-muted);
  }

  .search:focus {
    outline: 1px solid color-mix(in srgb, var(--fts-iris) 54%, transparent);
    border-color: var(--fts-iris);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--fts-iris) 14%, transparent);
  }

  .list {
    flex: 1;
    min-height: 0;
    overflow: auto;
    border: 1px solid color-mix(in srgb, var(--fts-highlight-high) 78%, transparent);
    border-radius: 16px;
    background: color-mix(in srgb, var(--fts-surface) 92%, black);
  }

  .empty {
    display: grid;
    place-items: center;
    min-height: 100%;
    padding: 24px;
    color: var(--fts-muted);
    font-size: 13px;
  }

  .footer {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    color: var(--fts-subtle);
    font-size: 11px;
  }

  .hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .key {
    padding: 3px 7px;
    border: 1px solid var(--fts-highlight-high);
    border-radius: 999px;
    color: var(--fts-gold);
    background: color-mix(in srgb, var(--fts-highlight-low) 88%, black);
  }

  @media (max-width: 720px) {
    :host {
      padding: 12px;
    }

    .panel {
      height: min(640px, calc(100vh - 24px));
      padding: 12px;
      border-radius: 14px;
    }

    .header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;
