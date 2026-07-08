import { useScrollReveal } from '../../hooks/useScrollReveal';
import { GitHubIcon, LinkedInIcon } from '../icons/SocialIcons';

export default function Hero() {
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section id="hero" className="hero reveal" ref={ref}>
      <div className="hero-main">
        <img
          className="hero-photo"
          src="/images/hero.jpg"
          alt="Serkan Dalgıç"
        />
        <div className="hero-content">
          <h1>Serkan Dalgıç</h1>
          <p className="hero-role">Full-Stack Developer</p>
          {/* TODO: Serkan ile birlikte gözden geçirilecek tagline */}
          <p className="hero-tagline">
            React ve TypeScript ile modern, güvenli ve ölçeklenebilir web uygulamaları geliştiriyorum.
          </p>
          <div className="hero-socials">
            <a href="https://github.com/srkngthb16" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub">
              <GitHubIcon />
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/serkan-dalgıç-37583b377/" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn">
              <LinkedInIcon />
              <span>LinkedIn</span>
            </a>
            <a href="#contact" className="social-link">
              İletişim
            </a>
          </div>
          <a href="#projects" className="hero-cta">
            Projelerimi Gör <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
