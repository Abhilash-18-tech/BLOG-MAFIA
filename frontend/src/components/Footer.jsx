const Footer = () => {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-[var(--muted)]">
        <div>© 2026 Blog Mafia</div>
        <div className="flex items-center gap-4">
          <a href="/" className="footer-link">Home</a>
          <a href="/about" className="footer-link">About</a>
          <a href="/contact" className="footer-link">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <span className="footer-link">X</span>
          <span className="footer-link">IG</span>
          <span className="footer-link">LI</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
