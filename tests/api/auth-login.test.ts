// tests/api/auth-login.test.ts
//
// Burada rate limiting'i MOCK'lamıyoruz, gerçek lib/rateLimit.js
// çalışıyor — bu sayede handler'ın rate limiter ile doğru "bağlandığını"
// (integration) da test etmiş oluyoruz. Sadece Supabase'i mock'luyoruz
// çünkü gerçek bir ağ isteği atmasını istemiyoruz.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockReq, createMockRes } from '../helpers/mockReqRes.js';

vi.mock('../../lib/supabase.js', () => ({
  supabase: { auth: { signInWithPassword: vi.fn() } },
}));

import handler from '../../api/auth/login.js';
import { supabase } from '../../lib/supabase.js';

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST dışındaki metodları 405 ile reddeder', async () => {
    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('email veya password eksikse 400 döner', async () => {
    const req = createMockReq({
      method: 'POST',
      body: { email: 'test@test.com' }, // password eksik
      headers: { 'x-forwarded-for': '10.0.0.1' },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('yanlış email/şifrede Supabase hatasını 401\'e çevirir', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'Invalid login credentials' },
    } as never);

    const req = createMockReq({
      method: 'POST',
      body: { email: 'test@test.com', password: 'yanlis-sifre' },
      headers: { 'x-forwarded-for': '10.0.0.2' },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    // Güvenlik notu: hangi alanın (email mi şifre mi) yanlış olduğunu
    // belirtmiyoruz — bu, saldırganın "bu email kayıtlı mı" diye
    // anlamasını (user enumeration) zorlaştırır.
    expect(res.json).toHaveBeenCalledWith({ error: 'Email veya şifre hatalı' });
  });

  it('doğru bilgilerle 200 ve access_token döner', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        session: { access_token: 'sahte-token', expires_in: 3600 },
        user: { id: 'u1', email: 'test@test.com' },
      },
      error: null,
    } as never);

    const req = createMockReq({
      method: 'POST',
      body: { email: 'test@test.com', password: 'dogru-sifre' },
      headers: { 'x-forwarded-for': '10.0.0.3' },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ access_token: 'sahte-token' })
    );
  });

  it('aynı IP\'den 5 denemeden sonra 6.\'sında 429 döner', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'Invalid login credentials' },
    } as never);

    const ip = '10.0.0.99'; // bu teste özel, diğer testlerle çakışmayan IP

    for (let i = 0; i < 5; i++) {
      const req = createMockReq({
        method: 'POST',
        body: { email: 'a@a.com', password: 'yanlis' },
        headers: { 'x-forwarded-for': ip },
      });
      const res = createMockRes();
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(401); // ilk 5 deneme normal işliyor
    }

    // 6. deneme artık rate limit'e takılmalı
    const req = createMockReq({
      method: 'POST',
      body: { email: 'a@a.com', password: 'yanlis' },
      headers: { 'x-forwarded-for': ip },
    });
    const res = createMockRes();
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(429);
  });
});
