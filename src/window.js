function openCenteredPopup() {
  const width = 400; // Set desired width
  const height = 300; // Set desired height
  const left = Math.round((screen.availWidth - width) / 2);
  const top = Math.round((screen.availHeight - height) / 2);

  // Create the popup window
  chrome.windows.create({
    url: "index.html", // URL of the popup
    type: "popup",
    width: width,
    height: height,
    left: left,
    top: top,
  });
}

export default openCenteredPopup;
