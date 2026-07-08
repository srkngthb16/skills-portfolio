import type { Project } from '../../types.ts';

interface ProjectsProps {
  projects: Project[];
  visibleProjects: Project[];
  showAllProjects: boolean;
  setShowAllProjects: (updater: (prev: boolean) => boolean) => void;
  hasMoreProjects: boolean;
}

export default function Projects({
  projects,
  visibleProjects,
  showAllProjects,
  setShowAllProjects,
  hasMoreProjects,
}: ProjectsProps) {
  return (
    <section id="projects" className="section fade-in" style={{ animationDelay: '160ms' }}>
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
  );
}
