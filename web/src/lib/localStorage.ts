export function getLocalStorage(key: string) {
  const value = localStorage.getItem(key);
  let cartItems = null;
  if (!value) return cartItems;
  try {
    cartItems = JSON.parse(value);
    return cartItems;
  } catch (e) {
    console.error(e);
    return null;
  }
}
