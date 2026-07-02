import { useState, useEffect } from 'react';
import './index.css';

const API_URL = '/api';

// Cihazın tercihini oku
function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);

  // Tema değişince <html> elementine class ekle/çıkar ve localStorage'a kaydet
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [skillsRes, projectsRes] = await Promise.all([
          fetch(`${API_URL}/skills`),
          fetch(`${API_URL}/projects`),
        ]);

        if (!skillsRes.ok || !projectsRes.ok) throw new Error('API hatası');

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
  }, []);

  const categories = ['Tümü', ...new Set(skills.map((s) => s.category))];
  const filteredSkills =
    activeCategory === 'Tümü'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const PROJECT_PREVIEW_COUNT = 6;
  const visibleProjects = showAllProjects
    ? projects
    : projects.slice(0, PROJECT_PREVIEW_COUNT);
  const hasMoreProjects = projects.length > PROJECT_PREVIEW_COUNT;

  if (loading) return <div className="status"><div className="spinner" /></div>;
  if (error) return <div className="status error">{error}</div>;

  return (
    <div className="app">
      <header className="header fade-in">
        <div className="header-top">
          <span className="eyebrow">Portfolyo · API</span>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Tema değiştir">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
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
            >
              {cat}
            </button>
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
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="project-link"
              >
                GitHub'da görüntüle <span className="arrow">→</span>
              </a>
            </div>
          ))}
        </div>
        {hasMoreProjects && (
          <button
            className="show-more"
            onClick={() => setShowAllProjects((prev) => !prev)}
          >
            {showAllProjects
              ? 'Daha az göster'
              : `Tüm projeleri göster (${projects.length})`}
            <span className={`chevron ${showAllProjects ? 'up' : ''}`}>⌄</span>
          </button>
        )}
      </section>
    </div>
  );
}

export default App;
