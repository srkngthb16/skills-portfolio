// lib/auth.js
// Token doğrulama — her korumalı endpoint bunu kullanır.
// Token geçerliyse kullanıcının token'ıyla yeni bir Supabase client döner.
// Bu client authenticated context'inde çalışır, RLS policy'leri doğru uygulanır.

import { createClient } from '@supabase/supabase-js';

export async function verifyToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  // Token'ı doğrula
  const adminClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data, error } = await adminClient.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  // Kullanıcının token'ıyla authenticated bir client oluştur
  const userClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );

  return { user: data.user, supabase: userClient };
}
