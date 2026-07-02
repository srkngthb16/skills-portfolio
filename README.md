# 🧩 Skills Portfolio

Yeteneklerimi ve GitHub projelerimi gösteren, kendi yazdığım API üzerinden çalışan portfolyo projesi.

🔗 **Canlı:** [skills-portfolio-opal.vercel.app](https://skills-portfolio-opal.vercel.app)

---

## ✨ Özellikler

- ⚛️ React (Vite) arayüz
- ☁️ Vercel serverless API
- 🐙 Projeler GitHub'dan **canlı** çekiliyor
- 🗄️ Yetenekler **Supabase** (PostgreSQL) veritabanında tutuluyor
- 🌙 Cihaz tercihine göre otomatik **dark / light mode** (kullanıcı siteden değiştirebilir)
- 📋 Tam **CRUD** desteği — GET, POST, PUT, DELETE

---

## 📁 Yapı

```
api/
  skills/
    index.js          → GET /api/skills
    [id].js           → GET /api/skills/:id
    create.js         → POST /api/skills/create
    update/[id].js    → PUT /api/skills/update/:id
    delete/[id].js    → DELETE /api/skills/delete/:id
  projects/
    index.js          → GET /api/projects  (GitHub API'den canlı)
    [id].js           → GET /api/projects/:id
lib/
  supabase.js         → merkezi veritabanı bağlantısı
data/
  skills.json         → fallback verisi
  projects.json       → fallback verisi
src/
  App.jsx             → React arayüzü
```

---

## ⚙️ Yerelde çalıştırma

```bash
npm install -g vercel
npm install
vercel dev
```

> Vercel CLI olmadan `/api` klasörü çalışmaz.

---

## 🔐 Environment Variables

| Değişken | Açıklama |
|---|---|
| `SUPABASE_URL` | Supabase proje URL'i |
| `SUPABASE_ANON_KEY` | Supabase anon public key |

---

## 🚀 Deploy

1. GitHub'a pushla
2. [vercel.com](https://vercel.com) → New Project → repoyu seç
3. Environment variable'ları ekle
4. Deploy 🎉

---

## 🛠️ Kullanılan teknolojiler

React · Vite · Vercel Serverless · Supabase (PostgreSQL) · GitHub REST API
