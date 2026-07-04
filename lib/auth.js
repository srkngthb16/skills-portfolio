// lib/auth.js
// Token doğrulama — her korumalı endpoint bunu kullanır.
//
// İstek header'ında şunu bekliyoruz:
// Authorization: Bearer <access_token>
//
// Token geçerliyse kullanıcı bilgisini döner, geçersizse null döner.

import { supabase } from './supabase.js';

export async function verifyToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}
