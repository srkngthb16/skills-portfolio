// api/projects/index.ts
// GET /api/projects — GitHub'dan canlı proje listesi çeker
//
// Önemli kavramlar:
// 1. Rate limit: GitHub, token'sız isteklerde saatte 60 istek hakkı veriyor.
//    Cevabı bir süre cache'liyoruz.
// 2. Fallback: GitHub'a ulaşılamazsa data/projects.json'a düşüyoruz.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { GitHubRepo, Project } from '../../lib/types.js';
import { applyCors } from '../../lib/cors.js';

const GITHUB_USERNAME = 'srkngthb16';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=created&direction=desc&per_page=100`;

function getFallbackProjects(): Project[] {
  const filePath = join(process.cwd(), 'data', 'projects.json');
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

// GitHubRepo → Project dönüşümü. Parametre ve dönüş tipini belirtince,
// yanlışlıkla var olmayan bir alana (örn. repo.languageX) erişmeye çalışırsak
// TypeScript anında hata verir.
function mapRepoToProject(repo: GitHubRepo): Project {
  return {
    id: repo.id,
    title: repo.name,
    description: repo.description || 'Açıklama eklenmemiş.',
    tech: [repo.language, ...(repo.topics || [])].filter(
      (t): t is string => Boolean(t)
    ),
    githubUrl: repo.html_url,
    date: repo.created_at.slice(0, 7),
    stars: repo.stargazers_count,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

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

    const repos = (await githubRes.json()) as GitHubRepo[];

    const projects = repos.filter((r) => !r.fork).map(mapRepoToProject);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(projects);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('GitHub API hatası, fallback kullanılıyor:', message);
    res.status(200).json(getFallbackProjects());
  }
}
