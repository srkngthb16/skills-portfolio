# 🧩 Skills Portfolio

Yeteneklerimi ve GitHub projelerimi gösteren, kendi yazdığım API üzerinden çalışan küçük bir portfolyo.

🔗 **Canlı:** [skills-portfolio-opal.vercel.app](https://skills-portfolio-opal.vercel.app)

---

## ✨ Neler var?

- ⚛️ React (Vite) arayüz
- ☁️ Vercel serverless API
- 🐙 Projeler GitHub'dan **canlı** çekiliyor — yeni repo açtığımda otomatik görünür
- 🎨 Sade, minimal tasarım

---

## 📁 Yapı

```
api/        → /api/skills ve /api/projects endpoint'leri
data/       → yedek (fallback) JSON verisi
src/        → React arayüzü
```

---

## ⚙️ Yerelde çalıştırma

```bash
npm install -g vercel
npm install
vercel dev
```

> API klasörü sadece `vercel dev` ile çalışır, düz `npm run dev` yetmez.

---

## 🚀 Deploy

1. GitHub'a pushla
2. [vercel.com](https://vercel.com) → New Project → repoyu seç
3. Deploy 🎉

---

## 🔜 Sırada ne var?

- [ ] CRUD (ekle / güncelle / sil)
- [ ] Gerçek bir veritabanı (Supabase)
- [ ] Authentication

---

🛠️ React · Vite · Vercel Serverless Functions · GitHub REST API
