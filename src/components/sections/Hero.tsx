export default function Hero() {
  return (
    <section id="hero" className="hero fade-in">
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
            {/* TODO: gerçek LinkedIn URL'si eklenecek */}
            <a href="https://github.com/srkngthb16" target="_blank" rel="noreferrer" className="social-link">
              GitHub
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="social-link">
              LinkedIn
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
