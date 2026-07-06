// tests/api/projects-index.test.ts
//
// Bu endpoint dış bir servise (GitHub API) bağımlı. Testte gerçek GitHub'a
// istek atmıyoruz — global fetch fonksiyonunu taklit ediyoruz. Bu, dış
// servislere bağımlı kodu test etmenin standart yöntemidir: "biz GitHub'ı
// test etmiyoruz, GitHub'dan gelen veriyle NE YAPTIĞIMIZI test ediyoruz."

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createMockReq, createMockRes } from '../helpers/mockReqRes.js';
import handler from '../../api/projects/index.js';

describe('GET /api/projects', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('GET dışındaki metodları 405 ile reddeder', async () => {
    const req = createMockReq({ method: 'POST' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('GitHub başarılı cevap verirse repoları Project şekline çevirir', async () => {
    const fakeRepos = [
      {
        id: 1,
        name: 'skills-portfolio',
        description: 'Test projesi',
        language: 'TypeScript',
        topics: ['react', 'vite'],
        html_url: 'https://github.com/x/skills-portfolio',
        created_at: '2025-09-01T00:00:00Z',
        stargazers_count: 3,
        fork: false,
      },
      {
        // fork olan repo listeye girmemeli
        id: 2,
        name: 'forked-repo',
        description: null,
        language: null,
        html_url: 'https://github.com/x/forked-repo',
        created_at: '2025-01-01T00:00:00Z',
        stargazers_count: 0,
        fork: true,
      },
    ];

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => fakeRepos,
    } as Response);

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const body = vi.mocked(res.json).mock.calls[0][0] as Array<{ title: string; tech: string[] }>;

    // fork'lanmış repo filtrelenmiş olmalı
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe('skills-portfolio');
    expect(body[0].tech).toEqual(['TypeScript', 'react', 'vite']);
  });

  it('GitHub hata dönerse (rate limit vb.) fallback JSON dosyasına düşer', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ message: 'API rate limit exceeded' }),
    } as Response);

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    // Fallback dosyasının gerçek içeriğini okuyup karşılaştırıyoruz —
    // böylece "her zaman aynı veri, kaynağı ne olursa olsun" garantisini test ediyoruz.
    const fallbackPath = join(process.cwd(), 'data', 'projects.json');
    const expected = JSON.parse(readFileSync(fallbackPath, 'utf-8'));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expected);
  });

  it('fetch ağ hatası (exception) fırlatırsa da fallback\'e düşer', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network error'));

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
