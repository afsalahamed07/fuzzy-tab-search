browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTabs") {
    browser.tabs.query({}).then((tabs) => {
      sendResponse(tabs); // Send the tabs back to the content script
    });
    return true; // Indicate that the response will be sent asynchronously
  }

  if (message.action === "highlightTab") {
    const { tabIndex } = message;
    browser.tabs.highlight({ tabs: tabIndex }).then(() => {
      console.log(`Switched to tab at index ${tabIndex}`);
    });
  }
});
