import type { Skill } from '../../types.ts';
import { useScrollReveal } from '../../hooks/useScrollReveal';

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
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section id="skills" className="section reveal" ref={ref}>
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
        {filteredSkills.map((skill) => (
          <div key={skill.id} className="skill-card">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-level">{skill.level}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
