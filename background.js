function sendAllTabs(sendResponse) {
  chrome.tabs.query({}).then((tabs) => {
    sendResponse(tabs);
  });
}

function focusTab(tabIndex) {
  return chrome.tabs.highlight({ tabs: tabIndex });
}

function closeTab(tabId) {
  return chrome.tabs.remove(tabId);
}

function openOverlayInActiveTab() {
  chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(([activeTab]) => {
      if (!activeTab?.id) {
        return;
      }

      return chrome.tabs.sendMessage(activeTab.id, { action: "openOverlay" });
    })
    .catch(() => {});
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-fuzzy-tab-search") {
    openOverlayInActiveTab();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTabs") {
    sendAllTabs(sendResponse);
    return true;
  }

  if (message.action === "highlightTab") {
    focusTab(message.tabIndex)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  if (message.action === "closeTab") {
    closeTab(message.tabId)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  return false;
});
