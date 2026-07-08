import { useScrollReveal } from '../../hooks/useScrollReveal';

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
          <span className="contact-link-label">GitHub</span>
          <span className="arrow">→</span>
        </a>
        {/* TODO: gerçek LinkedIn URL'si eklenecek */}
        <a href="#" target="_blank" rel="noreferrer" className="contact-link">
          <span className="contact-link-label">LinkedIn</span>
          <span className="arrow">→</span>
        </a>
        {/* TODO: gerçek e-posta adresi eklenecek */}
        <a href="mailto:serkan@example.com" className="contact-link">
          <span className="contact-link-label">E-posta</span>
          <span className="arrow">→</span>
        </a>
      </div>
    </section>
  );
}
