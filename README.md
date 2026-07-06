# 🧩 Skills Portfolio

Yeteneklerimi ve GitHub projelerimi gösteren, kendi yazdığım API üzerinden çalışan, tam CRUD ve giriş korumalı admin paneline sahip full-stack portfolyo projesi.

🔗 **Canlı:** [skills-portfolio-opal.vercel.app](https://skills-portfolio-opal.vercel.app)

---

## ✨ Özellikler

- ⚛️ React + **TypeScript** (Vite) arayüz
- ☁️ Vercel serverless API — tamamı **TypeScript**
- 🐙 Projeler GitHub'dan **canlı** çekiliyor (rate-limit korumalı, fallback'li)
- 🗄️ Yetenekler **Supabase** (PostgreSQL) veritabanında tutuluyor
- 🔐 **JWT tabanlı authentication** (Supabase Auth) — yazma işlemleri korumalı
- 🛠️ Animasyonlu **admin paneli** — giriş yap, yetenek ekle/düzenle/sil
- 🌙 Cihaz tercihine göre otomatik **dark / light mode**
- 📋 Tam **CRUD** desteği — GET, POST, PUT, DELETE

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
  types.ts              → paylaşılan backend tipleri
data/
  skills.json           → fallback verisi
  projects.json         → fallback verisi
src/
  App.tsx               → ana sayfa
  types.ts              → paylaşılan frontend tipleri
  pages/
    Login.tsx           → admin giriş ekranı
    Admin.tsx           → admin paneli (CRUD arayüzü)
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

---

## 🔐 Environment Variables

| Değişken | Açıklama |
|---|---|
| `SUPABASE_URL` | Supabase proje URL'i |
| `SUPABASE_ANON_KEY` | Supabase anon public key |
| `SUPABASE_SERVICE_KEY` | Supabase service_role key (sadece backend, RLS bypass için) |

---

## 🔑 Admin Paneli

Ana sayfadaki **Admin** butonuna basarak giriş ekranına ulaşılır (`/#login`). Giriş yapıldığında JWT token alınır ve yetenek ekleme/düzenleme/silme işlemleri bu token ile korunur. Kayıt (signup) özelliği bilinçli olarak kapalıdır — bu proje tek admin (tek kullanıcı) mantığıyla çalışır.

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

- [ ] Backend Security (rate limiting, input sanitization)
- [ ] Web Güvenliği (CORS politikası, güvenlik header'ları)
- [ ] Test (Jest ile API endpoint testleri)
- [ ] CI/CD (GitHub Actions)
