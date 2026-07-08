import type { Skill } from '../../types.ts';

interface SkillsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  filteredSkills: Skill[];
}

export default function Skills({
  categories,
  activeCategory,
  setActiveCategory,
  filteredSkills,
}: SkillsProps) {
  return (
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
  );
}
