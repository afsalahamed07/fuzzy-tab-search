import Fuse from "fuse.js";

const fuseOptions = {
  keys: ["title", "url"],
  includeScore: true,
  threshold: 0.4,
};

export function filterTabs(tabs, query) {
  const normalizedQuery = query.trim();

  if (normalizedQuery === "") {
    return tabs;
  }

  const fuse = new Fuse(tabs, fuseOptions);
  return fuse.search(normalizedQuery).map((result) => result.item);
}
