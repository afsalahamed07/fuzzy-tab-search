function sendAllTabs(sendResponse) {
  chrome.tabs.query({}).then((tabs) => {
    sendResponse(tabs);
  });
}

function focusTab(tabIndex) {
  chrome.tabs.highlight({ tabs: tabIndex });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTabs") {
    sendAllTabs(sendResponse);
    return true;
  }

  if (message.action === "highlightTab") {
    focusTab(message.tabIndex);
  }

  return false;
});
