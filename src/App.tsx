import { useState, useEffect } from 'react';
import Login from './pages/Login.tsx';
import Admin from './pages/Admin.tsx';
import Navbar from './components/layout/Navbar.tsx';
import Hero from './components/sections/Hero.tsx';
import About from './components/sections/About.tsx';
import Skills from './components/sections/Skills.tsx';
import Projects from './components/sections/Projects.tsx';
import Contact from './components/sections/Contact.tsx';
import type { Skill, Project, Theme, Page } from './types.ts';
import './index.css';

const API_URL = '/api';

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialPage(): Page {
  if (window.location.hash === '#admin') return 'admin';
  if (window.location.hash === '#login') return 'login';
  return 'home';
}

export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('access_token')
  );
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

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

  function handleLogin(t: string) {
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
  if (page === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onClose={() => {
          setPage('home');
          window.location.hash = '';
        }}
      />
    );
  }

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
    <>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onAdminClick={() => setPage(token ? 'admin' : 'login')}
      />
      <div className="app">
        <Hero />

        <About />

        <Skills
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filteredSkills={filteredSkills}
        />

        <Projects
          projects={projects}
          visibleProjects={visibleProjects}
          showAllProjects={showAllProjects}
          setShowAllProjects={setShowAllProjects}
          hasMoreProjects={hasMoreProjects}
        />

        <Contact />
      </div>
    </>
  );
}
