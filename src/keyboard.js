function isCtrlKey(event, key) {
  return event.ctrlKey && event.key.toLowerCase() === key;
}

export function bindGlobalShortcuts({ isOpen, closeOverlay }) {
  document.addEventListener(
    "keydown",
    (event) => {
      if (!isOpen()) {
        return;
      }

      event.stopPropagation();

      if (event.key === "Escape") {
        event.preventDefault();
        closeOverlay();
      }
    },
    true,
  );
}

export function bindSearchShortcuts(
  { isOpen },
  { selectCurrent, selectPrevious, selectNext, closeCurrent },
) {
  document.addEventListener(
    "keydown",
    (event) => {
      if (!isOpen()) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        selectCurrent();
        return;
      }

      if (isCtrlKey(event, "x")) {
        event.preventDefault();
        event.stopPropagation();
        closeCurrent();
        return;
      }

      if (isCtrlKey(event, "p")) {
        event.preventDefault();
        event.stopPropagation();
        selectPrevious();
        return;
      }

      if (isCtrlKey(event, "n")) {
        event.preventDefault();
        event.stopPropagation();
        selectNext();
      }
    },
    true,
  );
}
