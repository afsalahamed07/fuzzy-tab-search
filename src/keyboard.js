function isCtrlKey(event, key) {
  return event.ctrlKey && event.key.toLowerCase() === key;
}

export function bindGlobalShortcuts({ isOpen, closeOverlay }) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      event.preventDefault();
      closeOverlay();
    }
  });
}

export function bindSearchShortcuts(
  searchInput,
  { selectCurrent, selectPrevious, selectNext, closeCurrent },
) {
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      selectCurrent();
      return;
    }

    if (isCtrlKey(event, "x")) {
      event.preventDefault();
      closeCurrent();
      return;
    }

    if (isCtrlKey(event, "p")) {
      event.preventDefault();
      selectPrevious();
      return;
    }

    if (isCtrlKey(event, "n")) {
      event.preventDefault();
      selectNext();
    }
  });
}
