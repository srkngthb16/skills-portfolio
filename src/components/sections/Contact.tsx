import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { GitHubIcon, LinkedInIcon, MailIcon } from '../icons/SocialIcons';

type Status = 'idle' | 'sending' | 'success' | 'error';

// Not: EmailJS public key tasarımı gereği client tarafında açık kalabilir;
// istenirse EmailJS panelinden "Allowed origins" ile alan adına kısıtlanabilir.
const SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined) || 'service_hbsxqh4';
const TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined) || 'template_1xcz30d';
const PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined) || 'XrC92GDhG6voUNybL';

export default function Contact() {
  const ref = useScrollReveal<HTMLElement>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error('EmailJS yapılandırması eksik: VITE_EMAILJS_SERVICE_ID / VITE_EMAILJS_TEMPLATE_ID / VITE_EMAILJS_PUBLIC_KEY');
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { from_name: name, from_email: email, message },
        { publicKey: PUBLIC_KEY }
      );
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('E-posta gönderilemedi:', err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section contact reveal" ref={ref}>
      <h2>İletişim</h2>
      <p className="contact-intro">
        Bir proje fikriniz mi var, yoksa sadece merhaba mı demek istiyorsunuz? Aşağıdaki kanallardan ya da formdan ulaşabilirsiniz.
      </p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <input
            id="cf-name"
            name="from_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=" "
            required
            disabled={status === 'sending'}
          />
          <label htmlFor="cf-name">Adınız</label>
          <span className="field-underline" />
        </div>

        <div className="form-field">
          <input
            id="cf-email"
            name="from_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            required
            disabled={status === 'sending'}
          />
          <label htmlFor="cf-email">E-posta adresiniz</label>
          <span className="field-underline" />
        </div>

        <div className="form-field">
          <textarea
            id="cf-message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder=" "
            rows={4}
            required
            disabled={status === 'sending'}
          />
          <label htmlFor="cf-message">Mesajınız</label>
          <span className="field-underline" />
        </div>

        <button type="submit" className={`form-submit${status === 'sending' ? ' is-sending' : ''}`} disabled={status === 'sending'}>
          <span className="form-submit-label">{status === 'sending' ? 'Gönderiliyor' : 'Mesajı Gönder'}</span>
          <span className="form-submit-spinner" />
        </button>

        <div className={`form-status form-status-success${status === 'success' ? ' show' : ''}`} role="status">
          <span className="status-check">✓</span> Mesajınız gönderildi, en kısa sürede dönüş yapacağım.
        </div>
        <div className={`form-status form-status-error${status === 'error' ? ' show' : ''}`} role="alert">
          Mesaj gönderilemedi. Doğrudan e-posta üzerinden de ulaşabilirsiniz.
        </div>
      </form>

      <div className="contact-links">
        <a href="https://github.com/srkngthb16" target="_blank" rel="noreferrer" className="contact-link">
          <GitHubIcon />
          <span>GitHub</span>
        </a>
        <a href="https://www.linkedin.com/in/serkan-dalgıç-37583b377/" target="_blank" rel="noreferrer" className="contact-link">
          <LinkedInIcon />
          <span>LinkedIn</span>
        </a>
        <a href="mailto:sohbetler16_son@icloud.com" className="contact-link">
          <MailIcon />
          <span>sohbetler16_son@icloud.com</span>
        </a>
      </div>
    </section>
  );
}
