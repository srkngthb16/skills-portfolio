// tests/api/skills-create.test.ts
//
// Bu testte gerçek network/veritabanı çağrısı YAPMIYORUZ — lib/auth.js'i
// tamamen "mock"layarak (sahte bir verifyToken fonksiyonuyla değiştirerek)
// handler'ın mantığını (method kontrolü → auth kontrolü → validasyon →
// veritabanı işlemi) izole şekilde test ediyoruz. Buna "integration test"
// değil "unit test" denir çünkü dış bağımlılıkları taklit ediyoruz.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockReq, createMockRes } from '../helpers/mockReqRes.js';
import { createChainableSupabase } from '../helpers/supabaseMock.js';

// vi.mock çağrıları dosyanın en üstüne "hoist" edilir (otomatik taşınır),
// bu yüzden import'lardan önce yazılmış gibi çalışır.
vi.mock('../../lib/auth.js', () => ({
  verifyToken: vi.fn(),
}));

import handler from '../../api/skills/create.js';
import { verifyToken } from '../../lib/auth.js';

describe('POST /api/skills/create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST dışındaki metodları 405 ile reddeder', async () => {
    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('token yoksa 401 döner', async () => {
    vi.mocked(verifyToken).mockResolvedValue(null);

    const req = createMockReq({
      method: 'POST',
      body: { name: 'TypeScript', category: 'Frontend', level: 'Orta' },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('geçersiz girdiyi (boş isim) token olsa bile 400 ile reddeder', async () => {
    vi.mocked(verifyToken).mockResolvedValue({
      user: { id: 'u1' },
      supabase: createChainableSupabase({ data: null, error: null }),
    } as never);

    const req = createMockReq({
      method: 'POST',
      body: { name: '', category: 'Frontend', level: 'Orta' },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('geçerli girdiyle 201 ve eklenen veriyi döner', async () => {
    const inserted = { id: 1, name: 'TypeScript', category: 'Frontend', level: 'Orta' };
    vi.mocked(verifyToken).mockResolvedValue({
      user: { id: 'u1' },
      supabase: createChainableSupabase({ data: inserted, error: null }),
    } as never);

    const req = createMockReq({
      method: 'POST',
      body: { name: 'TypeScript', category: 'Frontend', level: 'Orta' },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(inserted);
  });

  it('veritabanı hata dönerse 500 ile cevap verir', async () => {
    vi.mocked(verifyToken).mockResolvedValue({
      user: { id: 'u1' },
      supabase: createChainableSupabase({ data: null, error: new Error('db down') }),
    } as never);

    const req = createMockReq({
      method: 'POST',
      body: { name: 'TypeScript', category: 'Frontend', level: 'Orta' },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
