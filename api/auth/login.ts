// api/auth/login.ts
// POST /api/auth/login → email + şifre alır, JWT token döner
//
// Supabase Auth kullanıyoruz — şifreyi biz tutmuyoruz, Supabase yönetiyor.
// Başarılı girişte Supabase bize bir access_token döner.
// Bu token'ı bundan sonra her CRUD isteğinde header'da göndereceğiz.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';

// İstek body'sinin nasıl bir şekle sahip olmasını beklediğimizi tanımlıyoruz.
// Bu bir "interface" — TypeScript'e "bu obje şu alanlara sahip olmalı" diyoruz.
interface LoginBody {
  email: string;
  password: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // req.body varsayılan olarak "any" tipindedir (Vercel ne geleceğini bilemez),
  // bu yüzden bizim beklediğimiz şekle (LoginBody) olduğunu belirtiyoruz.
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
    // TypeScript'te catch bloğundaki hata "unknown" tipindedir —
    // yani hangi tür bir hata olduğunu garanti edemeyiz, önce kontrol etmeliyiz.
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('Auth hatası:', message);
    res.status(500).json({ error: 'Giriş yapılamadı' });
  }
}
