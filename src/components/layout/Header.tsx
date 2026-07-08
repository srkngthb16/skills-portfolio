import type { Theme } from '../../types.ts';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  onAdminClick: () => void;
}

export default function Header({ theme, toggleTheme, onAdminClick }: HeaderProps) {
  return (
    <header className="header fade-in">
      <div className="header-top">
        <span className="eyebrow">Portfolyo · API</span>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Tema değiştir">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <a
            className="admin-nav-btn"
            href="#login"
            onClick={onAdminClick}
          >
            Admin
          </a>
        </div>
      </div>
      <h1>Serkan Dalgıç</h1>
      <p>Full-Stack Developer — Yetenekler &amp; Projeler</p>
    </header>
  );
}
