const selectedClassName = "is-selected";

export function getSelectedItem(tabList) {
  return tabList.querySelector(`.${selectedClassName}`);
}

function setSelectedItem(item) {
  item.classList.add(selectedClassName);
}

function clearSelectedItem(item) {
  item.classList.remove(selectedClassName);
}

export function selectFirstItem(tabList) {
  const firstItem = tabList.firstElementChild;

  if (firstItem) {
    setSelectedItem(firstItem);
  }
}

export function moveSelection(tabList, direction) {
  const current = getSelectedItem(tabList);

  if (!current) {
    selectFirstItem(tabList);
    return;
  }

  const next =
    direction === "previous"
      ? current.previousElementSibling
      : current.nextElementSibling;

  if (!next) {
    return;
  }

  clearSelectedItem(current);
  setSelectedItem(next);
  next.scrollIntoView({ block: "nearest" });
}

export function clickSelectedItem(tabList) {
  const selected = getSelectedItem(tabList);

  if (selected) {
    selected.click();
  }
}
