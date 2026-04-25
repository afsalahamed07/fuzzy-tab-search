function sendMessage(action, payload = {}) {
  console.log("[fts/msg] send", { action, payload });

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

      console.log("[fts/msg] response", { action, response });
      resolve(response);
    });
  });
}

function postMessage(action, payload = {}) {
  console.log("[fts/msg] post", { action, payload });
  chrome.runtime.sendMessage({ action, ...payload });
}

export async function getTabs() {
  const tabs = await sendMessage("getTabs");
  console.log("[fts/msg] tabs count", Array.isArray(tabs) ? tabs.length : 0);
  return Array.isArray(tabs) ? tabs : [];
}

export function highlightTab(tabIndex) {
  postMessage("highlightTab", { tabIndex });
}

export function closeTab(tabId) {
  return sendMessage("closeTab", { tabId });
}
