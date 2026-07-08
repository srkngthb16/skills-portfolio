import { useScrollReveal } from '../../hooks/useScrollReveal';
import { GitHubIcon, LinkedInIcon, MailIcon } from '../icons/SocialIcons';

export default function Contact() {
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section id="contact" className="section contact reveal" ref={ref}>
      <h2>İletişim</h2>
      <p className="contact-intro">
        Bir proje fikriniz mi var, yoksa sadece merhaba mı demek istiyorsunuz? Aşağıdaki kanallardan ulaşabilirsiniz.
      </p>
      <div className="contact-links">
        <a href="https://github.com/srkngthb16" target="_blank" rel="noreferrer" className="contact-link">
          <GitHubIcon />
          <span className="contact-link-label">GitHub</span>
          <span className="arrow">→</span>
        </a>
        <a href="https://www.linkedin.com/in/serkan-dalgıç-37583b377/" target="_blank" rel="noreferrer" className="contact-link">
          <LinkedInIcon />
          <span className="contact-link-label">LinkedIn</span>
          <span className="arrow">→</span>
        </a>
        <a href="mailto:sohbetler16_son@icloud.com" className="contact-link">
          <MailIcon />
          <span className="contact-link-label">E-posta</span>
          <span className="arrow">→</span>
        </a>
      </div>
    </section>
  );
}
