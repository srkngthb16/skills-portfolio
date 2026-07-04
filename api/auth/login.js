// api/auth/login.js
// POST /api/auth/login → email + şifre alır, JWT token döner
//
// Supabase Auth kullanıyoruz — şifreyi biz tutmuyoruz, Supabase yönetiyor.
// Başarılı girişte Supabase bize bir access_token döner.
// Bu token'ı bundan sonra her CRUD isteğinde header'da göndereceğiz.

import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

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

    // Başarılı giriş — token'ı döndür
    // access_token: API isteklerinde kullanılacak
    // expires_in: token'ın geçerlilik süresi (saniye)
    res.status(200).json({
      access_token: data.session.access_token,
      expires_in: data.session.expires_in,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (err) {
    console.error('Auth hatası:', err.message);
    res.status(500).json({ error: 'Giriş yapılamadı' });
  }
}
