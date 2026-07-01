// api/projects/index.js
// Vercel serverless function -> GET /api/projects
//
// Artık projeleri statik bir JSON dosyasından değil, GitHub'ın kendi
// REST API'sinden CANLI olarak çekiyoruz: api.github.com/users/{username}/repos
//
// Önemli kavramlar:
// 1. Rate limit: GitHub, kimliksiz (token'sız) isteklerde saatte 60 istek
//    hakkı veriyor. Bu yüzden cevabı bir süre "cache"liyoruz (aşağıda).
// 2. Fallback: GitHub API'ye ulaşılamazsa (limit dolar, internet sorunu vb.)
//    sitenin tamamen çökmemesi için yedek olarak data/projects.json'a düşüyoruz.

import { readFileSync } from 'fs';
import { join } from 'path';

const GITHUB_USERNAME = 'srkngthb16';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=created&direction=desc&per_page=100`;

function getFallbackProjects() {
  const filePath = join(process.cwd(), 'data', 'projects.json');
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

// GitHub'dan gelen ham repo verisini, bizim frontend'in beklediği
// sade formata çeviriyoruz.
function mapRepoToProject(repo) {
  return {
    id: repo.id,
    title: repo.name,
    description: repo.description || 'Açıklama eklenmemiş.',
    tech: [repo.language, ...(repo.topics || [])].filter(Boolean),
    githubUrl: repo.html_url,
    date: repo.created_at?.slice(0, 7), // "2025-09" formatına kısalt
    stars: repo.stargazers_count,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const githubRes = await fetch(GITHUB_API, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (!githubRes.ok) {
      throw new Error(`GitHub API ${githubRes.status} döndürdü`);
    }

    const repos = await githubRes.json();

    const projects = repos
      .filter((r) => !r.fork) // forklanmış repoları gösterme
      .map(mapRepoToProject);

    // Cevabı 1 saat boyunca Vercel'in CDN'inde önbellekte tut.
    // Böylece her ziyaretçi GitHub'a ayrı istek attırmıyor, rate limit korunuyor.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    res.status(200).json(projects);
  } catch (err) {
    // GitHub'a ulaşılamazsa sessizce yedek JSON'a düş
    console.error('GitHub API hatası, fallback kullanılıyor:', err.message);
    res.status(200).json(getFallbackProjects());
  }
}
