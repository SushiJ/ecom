export function getLocalStorage(key: string) {
  const value = localStorage.getItem(key);
  let item = null;
  if (!value) return item;
  try {
    item = JSON.parse(value);
    return item;
  } catch (e) {
    console.error(e);
    return null;
  }
}
