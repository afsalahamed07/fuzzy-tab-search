export function fuzzyMatch(query, text) {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  let queryIndex = 0;

  for (let char of textLower) {
    if (char === queryLower[queryIndex]) {
      queryIndex++;
    }
    if (queryIndex === queryLower.length) {
      return true;
    }
  }

  return false;
}
