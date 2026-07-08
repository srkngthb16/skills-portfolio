import { useState } from 'react';

const NAV_LINKS = [
  { href: '#hero', label: 'Anasayfa' },
  { href: '#about', label: 'Hakkımda' },
  { href: '#skills', label: 'Yetenekler' },
  { href: '#projects', label: 'Projeler' },
  { href: '#contact', label: 'İletişim' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  function handleLinkClick() {
    setOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#hero" className="navbar-brand" onClick={handleLinkClick}>
          Serkan Dalgıç
        </a>

        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </a>
          ))}
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menüyü aç/kapat"
          aria-expanded={open}
        >
          <span className={`navbar-toggle-bar ${open ? 'open' : ''}`} />
          <span className={`navbar-toggle-bar ${open ? 'open' : ''}`} />
          <span className={`navbar-toggle-bar ${open ? 'open' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="navbar-mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar-mobile-link"
              onClick={handleLinkClick}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
