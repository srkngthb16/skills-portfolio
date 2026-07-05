// api/auth/signup.js
// POST /api/auth/signup → yeni kullanıcı hesabı oluşturur
//
// Not: Bu proje şu an tek admin (senin) tarafından yönetiliyor,
// ama ileriki projelerde (çoklu kullanıcı gerektiren) aynı mantık kullanılabilir.
// Supabase varsayılan olarak e-posta doğrulaması ister — kullanıcı, gelen
// doğrulama linkine tıklamadan giriş yapamaz (Supabase Auth ayarına bağlı).

import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email ve password zorunludur' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Hesap oluşturuldu',
      user: { id: data.user?.id, email: data.user?.email },
    });
  } catch (err) {
    console.error('Signup hatası:', err.message);
    res.status(500).json({ error: 'Kayıt yapılamadı' });
  }
}
