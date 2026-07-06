// tests/api/skills-remove.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockReq, createMockRes } from '../helpers/mockReqRes.js';
import { createChainableSupabase } from '../helpers/supabaseMock.js';

vi.mock('../../lib/auth.js', () => ({
  verifyToken: vi.fn(),
}));

import handler from '../../api/skills/remove.js';
import { verifyToken } from '../../lib/auth.js';

describe('DELETE /api/skills/remove', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('token yoksa 401 döner', async () => {
    vi.mocked(verifyToken).mockResolvedValue(null);

    const req = createMockReq({ method: 'DELETE', query: {} });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('id parametresi yoksa 400 döner', async () => {
    vi.mocked(verifyToken).mockResolvedValue({
      user: { id: 'u1' },
      supabase: createChainableSupabase({ data: null, error: null }),
    } as never);

    const req = createMockReq({ method: 'DELETE', query: {} });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('bulunamayan id için 404 döner', async () => {
    vi.mocked(verifyToken).mockResolvedValue({
      user: { id: 'u1' },
      supabase: createChainableSupabase({ data: [], error: null }), // boş sonuç
    } as never);

    const req = createMockReq({ method: 'DELETE', query: { id: '999' } });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('başarılı silmede 200 ve silinen kaydı döner', async () => {
    const deleted = { id: 5, name: 'TypeScript', category: 'Frontend', level: 'Orta' };
    vi.mocked(verifyToken).mockResolvedValue({
      user: { id: 'u1' },
      supabase: createChainableSupabase({ data: [deleted], error: null }),
    } as never);

    const req = createMockReq({ method: 'DELETE', query: { id: '5' } });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Yetenek silindi', deleted });
  });

  it('veritabanı hatasında 500 döner', async () => {
    vi.mocked(verifyToken).mockResolvedValue({
      user: { id: 'u1' },
      supabase: createChainableSupabase({ data: null, error: new Error('boom') }),
    } as never);

    const req = createMockReq({ method: 'DELETE', query: { id: '5' } });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
