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
