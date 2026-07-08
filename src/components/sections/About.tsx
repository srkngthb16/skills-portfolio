const STATS = [
  // TODO: gerçek sayılarla güncellenecek
  { label: 'GitHub Reposu', value: '30+' },
  { label: 'Tamamlanan Proje', value: '10+' },
  { label: 'Sertifika', value: '5+' },
];

import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function About() {
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section id="about" className="section about reveal" ref={ref}>
      <h2>Hakkımda</h2>
      <div className="about-grid">
        <img
          className="about-photo"
          src="/images/about.jpg"
          alt="Serkan Dalgıç çalışırken"
        />
        <div className="about-content">
          {/* TODO: biyografi metni Serkan ile birlikte yazılacak */}
          <p className="about-bio">
            Kahramanmaraş Sütçü İmam Üniversitesi Bilgisayar Programcılığı mezunuyum.
            Frontend geliştirme üzerine derinleşirken full-stack yeteneklerimi
            genişletmeye devam ediyorum. Bu portfolyo, React, TypeScript, Vercel
            serverless fonksiyonları ve Supabase ile uçtan uca kurduğum bir proje.
          </p>

          <div className="about-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-card">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* TODO: güncel CV dosyası public/cv.pdf olarak eklenecek */}
          <a href="/cv.pdf" download className="cv-download">
            CV İndir <span className="arrow">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
