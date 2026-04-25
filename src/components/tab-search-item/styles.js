export const tabSearchItemStyles = `
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none;
  }

  button {
    all: unset;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    width: 100%;
    padding: 12px 14px;
    border-bottom: 1px solid var(--fts-highlight-high);
    background: transparent;
    color: var(--fts-text);
    cursor: pointer;
  }

  button:hover {
    background: color-mix(in srgb, var(--fts-highlight-med) 45%, transparent);
  }

  :host(.is-selected) button {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--fts-iris) 18%, transparent),
      color-mix(in srgb, var(--fts-foam) 12%, transparent)
    );
  }

  .meta {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .title,
  .hostname {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .title {
    color: var(--fts-text);
    font-size: 13px;
    line-height: 1.35;
  }

  .hostname {
    color: var(--fts-foam);
    font-size: 11px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .badge {
    align-self: center;
    padding: 4px 8px;
    border: 1px solid color-mix(in srgb, var(--fts-rose) 30%, transparent);
    border-radius: 999px;
    color: var(--fts-rose);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--fts-love) 8%, transparent);
  }
`;
