function sendMessage(action, payload = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action, ...payload }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("[fts/msg] runtime error", {
          action,
          message: chrome.runtime.lastError.message,
        });
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve(response);
    });
  });
}

function postMessage(action, payload = {}) {
  chrome.runtime.sendMessage({ action, ...payload });
}

export async function getTabs() {
  const tabs = await sendMessage("getTabs");
  return Array.isArray(tabs) ? tabs : [];
}

export function highlightTab(tabIndex) {
  postMessage("highlightTab", { tabIndex });
}

export function closeTab(tabId) {
  return sendMessage("closeTab", { tabId });
}
