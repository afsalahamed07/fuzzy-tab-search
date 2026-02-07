export function fetchTabs() {
  return chrome.tabs.query();
}
