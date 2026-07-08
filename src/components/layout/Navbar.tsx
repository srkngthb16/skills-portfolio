import { useState } from 'react';
import type { Theme } from '../../types.ts';

const NAV_LINKS = [
  { href: '#hero', label: 'Anasayfa' },
  { href: '#about', label: 'Hakkımda' },
  { href: '#skills', label: 'Yetenekler' },
  { href: '#projects', label: 'Projeler' },
  { href: '#contact', label: 'İletişim' },
];

interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
  onAdminClick: () => void;
}

export default function Navbar({ theme, toggleTheme, onAdminClick }: NavbarProps) {
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

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Tema değiştir">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <a className="admin-nav-btn" href="#login" onClick={onAdminClick}>
            Admin
          </a>

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
