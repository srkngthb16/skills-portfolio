// api/auth/login.ts
// POST /api/auth/login → email + şifre alır, JWT token döner
//
// Supabase Auth kullanıyoruz — şifreyi biz tutmuyoruz, Supabase yönetiyor.
// Başarılı girişte Supabase bize bir access_token döner.
// Bu token'ı bundan sonra her CRUD isteğinde header'da göndereceğiz.
//
// Güvenlik notu: bu endpoint rate-limit'li — aynı IP 5 dakikada en fazla
// 5 kez deneyebilir. Bu, şifre tahmin etmeye çalışan (brute-force) bir
// saldırıyı önemli ölçüde yavaşlatır.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';
import { applyCors } from '../../lib/cors.js';
import { isRateLimited, getClientIp } from '../../lib/rateLimit.js';

interface LoginBody {
  email: string;
  password: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return; // preflight isteği ise burada dur

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  if (isRateLimited(`login:${ip}`)) {
    return res.status(429).json({
      error: 'Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.',
    });
  }

  const { email, password } = req.body as LoginBody;

  if (!email || !password) {
    return res.status(400).json({ error: 'email ve password zorunludur' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Yanlış şifre veya email — güvenlik için detay vermiyoruz
      return res.status(401).json({ error: 'Email veya şifre hatalı' });
    }

    res.status(200).json({
      access_token: data.session.access_token,
      expires_in: data.session.expires_in,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('Auth hatası:', message);
    res.status(500).json({ error: 'Giriş yapılamadı' });
  }
}
