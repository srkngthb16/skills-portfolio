// tests/api/skills-index.test.ts
//
// Burada `supabase` modülünü, test başına farklı sonuçlar dönebilecek
// şekilde mock'luyoruz. vi.mock çağrısı dosyada bir kez çalıştığı için,
// "her testte farklı veri dönsün" istiyorsak değiştirilebilir bir durum
// (state) nesnesine ihtiyacımız var — bunu vi.hoisted ile oluşturuyoruz
// (vi.mock'tan ÖNCE çalışacağı garanti edilen özel bir Vitest aracı).

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockReq, createMockRes } from '../helpers/mockReqRes.js';

const state = vi.hoisted(() => ({
  result: { data: [] as unknown, error: null as unknown },
}));

vi.mock('../../lib/supabase.js', () => {
  const handler: ProxyHandler<object> = {
    get(_t, prop) {
      if (prop === 'then') {
        return (resolve: (v: typeof state.result) => void) => resolve(state.result);
      }
      return vi.fn(() => proxy);
    },
  };
  const proxy = new Proxy({}, handler);
  return { supabase: proxy };
});

import handler from '../../api/skills/index.js';

describe('GET /api/skills', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.result = { data: [], error: null };
  });

  it('GET dışındaki metodları 405 ile reddeder', async () => {
    const req = createMockReq({ method: 'POST' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('başarılı sorguda 200 ve veriyi döner', async () => {
    const skills = [
      { id: 1, name: 'HTML5', category: 'Frontend', level: 'Orta' },
      { id: 2, name: 'Node.js', category: 'Backend', level: 'Başlangıç' },
    ];
    state.result = { data: skills, error: null };

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(skills);
  });

  it('veritabanı hatasında 500 döner', async () => {
    state.result = { data: null, error: new Error('boom') };

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
