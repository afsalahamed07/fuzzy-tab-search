function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url || "unknown";
  }
}

export function formatTabLabel(tab) {
  const hostname = getHostname(tab.url);
  const title = tab.title || "untitled";
  return `${hostname} : ${title}`;
}
