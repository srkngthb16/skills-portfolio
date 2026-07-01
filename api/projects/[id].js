// api/projects/[id].js
// Vercel serverless function -> GET /api/projects/:id
// :id burada repo adı (örn. "ReactPortfolio") olarak kullanılıyor,
// çünkü artık veri GitHub'dan geliyor ve GitHub repoları isimle adresleniyor.

const GITHUB_USERNAME = 'srkngthb16';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const githubRes = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${id}`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );

    if (githubRes.status === 404) {
      return res.status(404).json({ error: 'Proje bulunamadı' });
    }

    if (!githubRes.ok) {
      throw new Error(`GitHub API ${githubRes.status} döndürdü`);
    }

    const repo = await githubRes.json();

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({
      id: repo.id,
      title: repo.name,
      description: repo.description || 'Açıklama eklenmemiş.',
      tech: [repo.language, ...(repo.topics || [])].filter(Boolean),
      githubUrl: repo.html_url,
      date: repo.created_at?.slice(0, 7),
      stars: repo.stargazers_count,
    });
  } catch (err) {
    res.status(502).json({ error: 'GitHub API\'ye ulaşılamadı' });
  }
}
