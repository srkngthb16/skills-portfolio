# 🧩 Skills Portfolio

Yeteneklerimi ve GitHub projelerimi gösteren, kendi yazdığım API üzerinden çalışan, tam CRUD ve giriş korumalı admin paneline sahip full-stack portfolyo projesi.

🔗 **Canlı:** [skills-portfolio-opal.vercel.app](https://skills-portfolio-opal.vercel.app)

---

## ✨ Özellikler

- ⚛️ React + **TypeScript** (Vite) arayüz
- 🧭 Navbar, Hero, Hakkımda, Yetenekler, Projeler, İletişim bölümleriyle tam bir tek-sayfa portfolyo
- 🎬 Scroll ile yavaş yavaş beliren bölümler (IntersectionObserver tabanlı, `prefers-reduced-motion` destekli)
- ⬆️ Animasyonlu "yukarı çık" butonu
- ✉️ **EmailJS** ile çalışan animasyonlu iletişim formu — mesajlar doğrudan e-postaya düşer
- ☁️ Vercel serverless API — tamamı **TypeScript**
- 🐙 Projeler GitHub'dan **canlı** çekiliyor (rate-limit korumalı, fallback'li)
- 🗄️ Yetenekler **Supabase** (PostgreSQL) veritabanında tutuluyor
- 🔐 **JWT tabanlı authentication** (Supabase Auth) — yazma işlemleri korumalı
- 🛠️ Animasyonlu **admin paneli** — giriş yap, yetenek ekle/düzenle/sil
- 🌙 Cihaz tercihine göre otomatik **dark / light mode**
- 📋 Tam **CRUD** desteği — GET, POST, PUT, DELETE
- 🛡️ Güvenlik katmanı — CORS, rate limiting, input validation, security header'ları

---

## 📁 Yapı

```
api/
  auth/
    login.ts            → POST /api/auth/login
  skills/
    index.ts            → GET /api/skills
    [id].ts             → GET /api/skills/:id
    create.ts           → POST /api/skills/create        (token gerekli)
    update/[id].ts       → PUT /api/skills/update/:id     (token gerekli)
    remove.ts            → DELETE /api/skills/remove?id=  (token gerekli)
  projects/
    index.ts            → GET /api/projects   (GitHub API'den canlı)
    [id].ts             → GET /api/projects/:id
lib/
  supabase.ts           → merkezi veritabanı bağlantısı
  auth.ts               → JWT doğrulama + authenticated Supabase client
  cors.ts               → CORS politikası (izinli origin kontrolü)
  rateLimit.ts          → login için brute-force koruması
  validate.ts           → girdi doğrulama ve temizleme
  types.ts              → paylaşılan backend tipleri
data/
  skills.json           → fallback verisi
  projects.json         → fallback verisi
src/
  App.tsx               → ana sayfa, tüm bölümleri bir araya getirir
  types.ts              → paylaşılan frontend tipleri
  hooks/
    useScrollReveal.ts   → scroll ile beliren bölümler için IntersectionObserver hook'u
  components/
    layout/
      Navbar.tsx         → sticky navbar (tema butonu + admin linki + mobil hamburger)
      ScrollToTop.tsx    → animasyonlu yukarı çık butonu
    sections/
      Hero.tsx           → foto, isim, unvan, sosyal linkler, CTA
      About.tsx          → foto, biyografi, istatistik kartları, CV linki
      Skills.tsx         → filtrelenebilir yetenek listesi
      Projects.tsx       → GitHub'dan çekilen proje kartları
      Contact.tsx        → EmailJS formu + iletişim linkleri
    icons/
      SocialIcons.tsx    → inline SVG marka ikonları (GitHub, LinkedIn, Mail, Send)
  pages/
    Login.tsx            → admin giriş ekranı
    Admin.tsx            → admin paneli (CRUD arayüzü)
tests/
  lib/                  → saf mantık testleri (validate, rateLimit, cors)
  api/                  → handler testleri (Supabase/GitHub mock'lanarak)
  helpers/              → test yardımcıları (mock req/res, mock Supabase client)
.github/workflows/
  ci.yml                → her push'ta typecheck + test + build çalıştırır
```

---

## ⚙️ Yerelde çalıştırma

```bash
npm install -g vercel
npm install
vercel dev
```

> Vercel CLI olmadan `/api` klasörü çalışmaz.

Tip kontrolü için:

```bash
npm run typecheck
```

Testleri çalıştırmak için:

```bash
npm test          # tek seferlik çalıştırma
npm run test:watch # dosya değiştikçe otomatik yeniden çalıştırma
```

---

## 🔐 Environment Variables

| Değişken | Açıklama |
|---|---|
| `SUPABASE_URL` | Supabase proje URL'i |
| `SUPABASE_ANON_KEY` | Supabase anon public key |
| `SUPABASE_SERVICE_KEY` | Supabase service_role key (sadece backend, RLS bypass için) |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS servis kimliği (opsiyonel — verilmezse koddaki varsayılan kullanılır) |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template kimliği (opsiyonel) |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key — client tarafında açık olması tasarımı gereği normaldir (opsiyonel) |

---

## 🔑 Admin Paneli

Ana sayfadaki **Admin** butonuna basarak giriş ekranına ulaşılır (`/#login`). Giriş yapıldığında JWT token alınır ve yetenek ekleme/düzenleme/silme işlemleri bu token ile korunur. Kayıt (signup) özelliği bilinçli olarak kapalıdır — bu proje tek admin (tek kullanıcı) mantığıyla çalışır.

---

## 🧪 Test

**Vitest** kullanıyoruz — roadmap'te "Jest" geçse de, proje zaten Vite kullandığı için Vitest ekstra yapılandırma gerektirmeden aynı API'yle (`describe`, `it`, `expect`) çalışıyor.

44 test şunları kapsıyor:
- **Saf mantık testleri** — `validate.ts`, `rateLimit.ts`, `cors.ts` (dış bağımlılık yok, en güvenilir testler)
- **API handler testleri** — Supabase ve GitHub API'si "mock"lanarak (gerçek ağ isteği atılmadan) `login`, `create`, `remove`, `skills`, `projects` endpoint'leri test ediliyor
- **Güvenlik davranışı testleri** — rate limiter'ın gerçekten 6. denemeyi engellediği, CORS'un izinsiz origin'e header eklemediği gibi senaryolar

---

## ⚙️ CI/CD

`.github/workflows/ci.yml` — `main` branch'ine her push/PR'da otomatik olarak:
1. Bağımlılıkları kurar
2. Tip kontrolü yapar (`npm run typecheck`)
3. Testleri çalıştırır (`npm test`)
4. Production build alır (`npm run build`)

Herhangi biri başarısız olursa GitHub'da kırmızı ✕ görünür — kod Vercel'e deploy olmadan hatayı erkenden yakalamış oluruz.

---

## 🛡️ Güvenlik

Bu proje, OWASP Top 10'daki yaygın web açıklarına karşı şu önlemleri alıyor:

| Tehdit | Önlem |
|---|---|
| **SQL Injection** | Supabase client parametreli sorgu kullanıyor, ham SQL string birleştirme yok |
| **Brute-force (kimlik doğrulama)** | `/api/auth/login` rate-limitli — aynı IP 5 dakikada en fazla 5 deneme (`lib/rateLimit.ts`) |
| **XSS** | React varsayılan olarak render edilen metni escape eder; girdiler ayrıca sunucu tarafında da doğrulanır (`lib/validate.ts`) |
| **CSRF** | Cookie tabanlı oturum yok — Bearer token (JWT) kullanılıyor, tarayıcı bunu otomatik göndermez |
| **CORS** | API sadece izinli origin'lerden (kendi sitemiz + yerel geliştirme) çağrılabilir (`lib/cors.ts`) |
| **Yetkisiz veri değişikliği** | Yazma işlemleri (POST/PUT/DELETE) JWT + Supabase RLS ile çift katmanlı korunuyor |
| **Şifre güvenliği** | Şifreler bizim tarafımızdan değil, Supabase Auth (bcrypt) tarafından hash'leniyor |
| **Clickjacking** | `X-Frame-Options: DENY` header'ı sayfanın iframe içine gömülmesini engelliyor |
| **MIME sniffing** | `X-Content-Type-Options: nosniff` header'ı |
| **HTTPS zorlaması** | `Strict-Transport-Security` header'ı + Vercel'in otomatik HTTPS'i |
| **Girdi doğrulama** | İsim uzunluğu sınırlı, kategori/seviye alanları sabit bir listeyle (whitelist) kontrol ediliyor |

**Bilinçli kabul edilen sınırlama:** Rate limiter bellek-içi (in-memory) çalışıyor — Vercel fonksiyonu "cold start" olduğunda sıfırlanabilir. Küçük ölçekli bir proje için yeterli bir ilk koruma katmanı; büyük ölçekte Upstash Redis veya Vercel KV gibi paylaşımlı bir depo kullanılması gerekir.

---

## 🚀 Deploy

1. GitHub'a pushla
2. [vercel.com](https://vercel.com) → New Project → repoyu seç
3. Environment variable'ları ekle
4. Deploy 🎉

---

## 🛠️ Kullanılan teknolojiler

React · TypeScript · Vite · Vercel Serverless Functions · Supabase (PostgreSQL + Auth) · GitHub REST API

---

## 🔜 Sırada ne var?

- [x] Backend Security (rate limiting, input sanitization)
- [x] Web Güvenliği (CORS politikası, güvenlik header'ları)
- [x] Test (Vitest ile 44 test — unit + handler testleri)
- [x] CI/CD (GitHub Actions — typecheck + test + build)
- [x] Navbar, Hero, Hakkımda, İletişim bölümleri (App.tsx parçalandı)
- [x] Scroll reveal animasyonu + bölümler arası ferah boşluklar
- [x] Animasyonlu yukarı çık butonu
- [x] İnline SVG marka ikonları (GitHub, LinkedIn, Mail, Send)
- [x] EmailJS ile animasyonlu iletişim formu (ortalanmış, floating label)
