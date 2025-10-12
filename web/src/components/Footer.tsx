export function Footer() {
  const ccDate = new Date().getFullYear();
  return (
    <footer className="text-center">
      <p>Shoppy cc {ccDate}</p>
    </footer>
  );
}
