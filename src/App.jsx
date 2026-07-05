import { useState, useEffect } from 'react';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import './index.css';

const API_URL = '/api';

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialPage() {
  if (window.location.hash === '#admin') return 'admin';
  if (window.location.hash === '#login') return 'login';
  return 'home';
}

export default function App() {
  const [page, setPage] = useState(getInitialPage);
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // Admin/login linklerini hash ile yönet
  useEffect(() => {
    function onHash() {
      const h = window.location.hash;
      if (h === '#admin') setPage(token ? 'admin' : 'login');
      else if (h === '#login') setPage('login');
      else setPage('home');
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [token]);

  function handleLogin(t) {
    setToken(t);
    setPage('admin');
    window.location.hash = '#admin';
  }

  function handleLogout() {
    localStorage.removeItem('access_token');
    setToken(null);
    setPage('home');
    window.location.hash = '';
  }

  useEffect(() => {
    if (page !== 'home') return;
    async function fetchData() {
      try {
        setLoading(true);
        const [skillsRes, projectsRes] = await Promise.all([
          fetch(`${API_URL}/skills`),
          fetch(`${API_URL}/projects`),
        ]);
        if (!skillsRes.ok || !projectsRes.ok) throw new Error();
        setSkills(await skillsRes.json());
        setProjects(await projectsRes.json());
        setError(null);
      } catch {
        setError("API'ye bağlanılamadı.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page]);

  // Login sayfası
  if (page === 'login') return <Login onLogin={handleLogin} />;

  // Admin paneli
  if (page === 'admin') {
    if (!token) {
      setPage('login');
      return null;
    }
    return <Admin token={token} onLogout={handleLogout} />;
  }

  // Ana sayfa
  const categories = ['Tümü', ...new Set(skills.map((s) => s.category))];
  const filteredSkills = activeCategory === 'Tümü'
    ? skills : skills.filter((s) => s.category === activeCategory);

  const PROJECT_PREVIEW_COUNT = 6;
  const visibleProjects = showAllProjects
    ? projects : projects.slice(0, PROJECT_PREVIEW_COUNT);
  const hasMoreProjects = projects.length > PROJECT_PREVIEW_COUNT;

  if (loading) return <div className="status"><div className="spinner" /></div>;
  if (error) return <div className="status error">{error}</div>;

  return (
    <div className="app">
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
              onClick={() => setPage(token ? 'admin' : 'login')}
            >
              Admin
            </a>
          </div>
        </div>
        <h1>Serkan Dalgıç</h1>
        <p>Frontend Developer — Yetenekler &amp; Projeler</p>
      </header>

      <section className="section fade-in" style={{ animationDelay: '80ms' }}>
        <h2>Yetenekler</h2>
        <div className="filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={cat === activeCategory ? 'filter active' : 'filter'}
              onClick={() => setActiveCategory(cat)}
            >{cat}</button>
          ))}
        </div>
        <div className="skills-grid">
          {filteredSkills.map((skill, i) => (
            <div
              key={skill.id}
              className="skill-card fade-in-up"
              style={{ animationDelay: `${80 + i * 35}ms` }}
            >
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">{skill.level}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section fade-in" style={{ animationDelay: '160ms' }}>
        <h2>Projeler</h2>
        <div className="projects-grid">
          {visibleProjects.map((project, i) => (
            <div
              key={project.id}
              className="project-card fade-in-up"
              style={{ animationDelay: `${200 + i * 60}ms` }}
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-list">
                {project.tech.map((t) => (
                  <span key={t} className="tech-pill">{t}</span>
                ))}
              </div>
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-link">
                GitHub'da görüntüle <span className="arrow">→</span>
              </a>
            </div>
          ))}
        </div>
        {hasMoreProjects && (
          <button className="show-more" onClick={() => setShowAllProjects((p) => !p)}>
            {showAllProjects ? 'Daha az göster' : `Tüm projeleri göster (${projects.length})`}
            <span className={`chevron ${showAllProjects ? 'up' : ''}`}>⌄</span>
          </button>
        )}
      </section>
    </div>
  );
}
