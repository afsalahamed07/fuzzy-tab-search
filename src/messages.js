function sendMessage(action, payload = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action, ...payload }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve(response);
    });
  });
}

export async function getTabs() {
  const tabs = await sendMessage("getTabs");
  return Array.isArray(tabs) ? tabs : [];
}

export function highlightTab(tabIndex) {
  chrome.runtime.sendMessage({ action: "highlightTab", tabIndex });
}
